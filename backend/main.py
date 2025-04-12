from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from auth import get_password_hash, create_access_token, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user
import json
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load environment variables
load_dotenv()

# Load or create database files
DB_PATH = "backend/db"
USERS_DB_FILE = os.path.join(DB_PATH, "users.json")
BLOGS_DB_FILE = os.path.join(DB_PATH, "blogs.json")

# Create DB directory if it doesn't exist
os.makedirs(DB_PATH, exist_ok=True)

# Initialize or load databases
def load_db(file_path: str) -> dict:
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            return json.load(f)
    return {}

def save_db(data: dict, file_path: str):
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

# Models
class BlogPost(BaseModel):
    id: Optional[str] = None
    title: str
    content: str
    author: str
    status: str = "draft"  # 'draft' or 'published'
    views: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class UserCreate(BaseModel):
    email: str
    password: str

class User(BaseModel):
    email: str
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class BlogGenerationParams(BaseModel):
    title: str
    topic: str
    keywords: str
    tone: str
    length: str

class PasswordResetRequest(BaseModel):
    email: str

class PasswordReset(BaseModel):
    token: str
    new_password: str

# Initialize FastAPI app
app = FastAPI(
    title="Automated Blog Generator API",
    description="API for generating and managing blog content using AI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Load databases
fake_users_db = load_db(USERS_DB_FILE)
fake_blogs_db = load_db(BLOGS_DB_FILE)

# Mock reset token storage (replace with database later)
password_reset_tokens = {}

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL")

def send_reset_email(to_email: str, reset_token: str):
    if not all([SMTP_USERNAME, SMTP_PASSWORD, SMTP_FROM_EMAIL]):
        # For development, just print the token
        print(f"Development mode: Reset token for {to_email}: {reset_token}")
        return
    
    try:
        reset_link = f"http://localhost:5173/reset-password?token={reset_token}"
        
        message = MIMEMultipart("alternative")
        message["Subject"] = "Password Reset Request"
        message["From"] = SMTP_FROM_EMAIL
        message["To"] = to_email

        text = f"""
        Hello,

        You have requested to reset your password. Click the link below to reset it:
        {reset_link}

        If you did not request this reset, please ignore this email.

        This link will expire in 30 minutes.

        Best regards,
        Your Blog Generator Team
        """

        html = f"""
        <html>
          <body>
            <p>Hello,</p>
            <p>You have requested to reset your password. Click the link below to reset it:</p>
            <p><a href="{reset_link}">{reset_link}</a></p>
            <p>If you did not request this reset, please ignore this email.</p>
            <p>This link will expire in 30 minutes.</p>
            <br>
            <p>Best regards,<br>Your Blog Generator Team</p>
          </body>
        </html>
        """

        message.attach(MIMEText(text, "plain"))
        message.attach(MIMEText(html, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(message)
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        # For development, still print the token if email fails
        print(f"Development mode: Reset token for {to_email}: {reset_token}")

@app.get("/")
async def root() -> Dict[str, str]:
    try:
        return {"message": "Welcome to the Automated Blog Generator API"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check() -> Dict[str, str]:
    return {"status": "healthy"}

@app.post("/blog/generate")
async def generate_blog(params: BlogGenerationParams, current_user = Depends(get_current_user)) -> Dict[str, str]:
    try:
        # TODO: Implement AI blog generation logic
        # For now, return a mock response
        mock_content = f"""
        Title: {params.title}
        
        This is a mock blog post about {params.topic}.
        Keywords: {params.keywords}
        Tone: {params.tone}
        Length: {params.length}
        
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        """
        return {"content": mock_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/blog/{blog_id}")
async def get_blog(blog_id: str, token: str = Depends(oauth2_scheme)) -> BlogPost:
    try:
        if blog_id not in fake_blogs_db:
            raise HTTPException(status_code=404, detail="Blog not found")
        return BlogPost(**fake_blogs_db[blog_id])  # Convert dict back to BlogPost model
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/blogs")
async def list_blogs(token: str = Depends(oauth2_scheme)) -> List[BlogPost]:
    try:
        return [BlogPost(**blog) for blog in fake_blogs_db.values()]  # Convert dicts back to BlogPost models
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/blog")
async def create_blog(blog: BlogPost, token: str = Depends(oauth2_scheme)) -> BlogPost:
    try:
        blog.id = str(len(fake_blogs_db) + 1)
        blog.created_at = datetime.now()
        blog.updated_at = datetime.now()
        fake_blogs_db[blog.id] = blog.dict()  # Convert to dict for JSON serialization
        save_db(fake_blogs_db, BLOGS_DB_FILE)
        return blog
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/register", response_model=Dict[str, str])
async def register_user(user: UserCreate):
    if user.email in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    user_db = UserInDB(
        email=user.email,
        hashed_password=hashed_password,
        disabled=False
    )
    fake_users_db[user.email] = user_db.dict()  # Convert to dict for JSON serialization
    save_db(fake_users_db, USERS_DB_FILE)
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": "User registered successfully"
    }

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Note: OAuth2PasswordRequestForm uses username field for credentials
    user = fake_users_db.get(form_data.username)  # form_data.username will contain the email
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Convert dict back to UserInDB model
    user = UserInDB(**user)
    
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user = Depends(get_current_user)):
    user_email = current_user["username"]  # contains email due to backward compatibility
    if user_email not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    user = fake_users_db[user_email]
    return User(
        email=user["email"],
        disabled=user["disabled"]
    )

@app.put("/blog/{blog_id}")
async def update_blog(blog_id: str, updates: BlogPost, current_user = Depends(get_current_user)) -> BlogPost:
    try:
        if blog_id not in fake_blogs_db:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        # Update only allowed fields
        blog = BlogPost(**fake_blogs_db[blog_id])  # Convert dict to BlogPost
        blog.title = updates.title
        blog.content = updates.content
        blog.status = updates.status
        blog.updated_at = datetime.now()
        
        fake_blogs_db[blog_id] = blog.dict()  # Convert back to dict for storage
        save_db(fake_blogs_db, BLOGS_DB_FILE)
        return blog
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/blog/{blog_id}")
async def delete_blog(blog_id: str, current_user = Depends(get_current_user)) -> Dict[str, str]:
    try:
        if blog_id not in fake_blogs_db:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        del fake_blogs_db[blog_id]
        save_db(fake_blogs_db, BLOGS_DB_FILE)
        return {"message": "Blog deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest) -> Dict[str, str]:
    if request.email not in fake_users_db:
        # For security, don't reveal if email exists
        return {"message": "If the email exists, you will receive a password reset link"}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    # Store token with expiry (30 minutes)
    password_reset_tokens[reset_token] = {
        "email": request.email,
        "expires": datetime.utcnow() + timedelta(minutes=30)
    }
    
    # In development: return the token directly
    # In production: this would send an email instead
    return {
        "message": "Password reset instructions sent",
        "token": reset_token  # Development only
    }

@app.post("/reset-password")
async def reset_password(reset: PasswordReset) -> Dict[str, str]:
    # Verify token exists and is valid
    token_data = password_reset_tokens.get(reset.token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Check if token is expired
    if datetime.utcnow() > token_data["expires"]:
        del password_reset_tokens[reset.token]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired"
        )
    
    # Update user's password
    email = token_data["email"]
    user = fake_users_db[email]
    user["hashed_password"] = get_password_hash(reset.new_password)
    fake_users_db[email] = user
    save_db(fake_users_db, USERS_DB_FILE)
    
    # Remove used token
    del password_reset_tokens[reset.token]
    
    return {"message": "Password has been reset successfully"} 