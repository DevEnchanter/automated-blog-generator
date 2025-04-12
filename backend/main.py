from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from auth import get_password_hash, create_access_token, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user

# Load environment variables
load_dotenv()

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
    username: str
    email: str
    password: str

class User(BaseModel):
    username: str
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

# Mock database (replace with actual database later)
fake_users_db = {}
fake_blogs_db = {}

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
        return fake_blogs_db[blog_id]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/blogs")
async def list_blogs(token: str = Depends(oauth2_scheme)) -> List[BlogPost]:
    try:
        return list(fake_blogs_db.values())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/blog")
async def create_blog(blog: BlogPost, token: str = Depends(oauth2_scheme)) -> BlogPost:
    try:
        blog.id = str(len(fake_blogs_db) + 1)
        blog.created_at = datetime.now()
        blog.updated_at = datetime.now()
        fake_blogs_db[blog.id] = blog
        return blog
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/register", response_model=Dict[str, str])
async def register_user(user: UserCreate):
    if user.username in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    user_db = UserInDB(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        disabled=False
    )
    fake_users_db[user.username] = user_db
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": "User registered successfully"
    }

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user = Depends(get_current_user)):
    if current_user["username"] not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    user = fake_users_db[current_user["username"]]
    return User(
        username=user.username,
        email=user.email,
        disabled=user.disabled
    )

@app.put("/blog/{blog_id}")
async def update_blog(blog_id: str, updates: BlogPost, current_user = Depends(get_current_user)) -> BlogPost:
    try:
        if blog_id not in fake_blogs_db:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        # Update only allowed fields
        blog = fake_blogs_db[blog_id]
        blog.title = updates.title
        blog.content = updates.content
        blog.status = updates.status
        blog.updated_at = datetime.now()
        
        fake_blogs_db[blog_id] = blog
        return blog
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/blog/{blog_id}")
async def delete_blog(blog_id: str, current_user = Depends(get_current_user)) -> Dict[str, str]:
    try:
        if blog_id not in fake_blogs_db:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        del fake_blogs_db[blog_id]
        return {"message": "Blog deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 