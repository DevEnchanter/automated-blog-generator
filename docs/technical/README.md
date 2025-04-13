# Technical Integration Guide

## Google Gemini API Integration

### Setup and Configuration

1. **Enable Gemini API**
   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```

2. **Authentication**
   ```python
   import google.generativeai as genai
   
   genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
   ```

3. **Model Configuration**
   ```python
   model = genai.GenerativeModel('gemini-pro')
   ```

### Content Generation Service

```python
from typing import List, Optional
from pydantic import BaseModel

class BlogGenerationRequest(BaseModel):
    title: str
    topic: str
    keywords: List[str]
    tone: str
    length: str

class ContentGenerationService:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')

    async def generate_blog_post(self, request: BlogGenerationRequest) -> str:
        prompt = self._create_prompt(request)
        response = await self.model.generate_content_async(prompt)
        return response.text

    def _create_prompt(self, request: BlogGenerationRequest) -> str:
        return f"""
        Write a blog post about {request.topic}
        Title: {request.title}
        Keywords: {', '.join(request.keywords)}
        Tone: {request.tone}
        Length: {request.length}
        """
```

### Error Handling

```python
from google.api_core import retry
from google.api_core import exceptions

class GeminiAPIError(Exception):
    pass

@retry.Retry(predicate=retry.if_exception_type(
    exceptions.ResourceExhausted,
    exceptions.ServiceUnavailable
))
async def generate_with_retry(self, prompt: str) -> str:
    try:
        response = await self.model.generate_content_async(prompt)
        return response.text
    except exceptions.GoogleAPIError as e:
        raise GeminiAPIError(f"Gemini API error: {str(e)}")
```

## Firebase Integration

### Firebase Admin Setup

```python
import firebase_admin
from firebase_admin import credentials, firestore, auth

cred = credentials.Certificate({
    "type": "service_account",
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL")
})

firebase_admin.initialize_app(cred)
db = firestore.client()
```

### Authentication Service

```python
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

class AuthService:
    @staticmethod
    async def verify_token(
        credentials: HTTPAuthorizationCredentials = Security(security)
    ) -> dict:
        try:
            token = credentials.credentials
            decoded_token = auth.verify_id_token(token)
            return decoded_token
        except Exception as e:
            raise HTTPException(
                status_code=401,
                detail=f"Invalid authentication credentials: {str(e)}"
            )
```

### Firestore Data Models

```python
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class BlogPost(BaseModel):
    id: str
    title: str
    content: str
    author_id: str
    status: str
    created_at: datetime
    updated_at: datetime
    tags: List[str]
    category: str

class FirestoreService:
    def __init__(self):
        self.db = firestore.client()
        self.posts_ref = self.db.collection('posts')

    async def create_post(self, post: BlogPost) -> str:
        doc_ref = self.posts_ref.document()
        await doc_ref.set(post.dict())
        return doc_ref.id

    async def get_post(self, post_id: str) -> Optional[BlogPost]:
        doc = await self.posts_ref.document(post_id).get()
        return BlogPost(**doc.to_dict()) if doc.exists else None
```

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.auth.uid == resource.data.author_id;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

## Frontend Integration

### Firebase Client Setup

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Authentication Hook

```typescript
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
```

### API Service

```typescript
import axios from 'axios';
import { auth } from '../config/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const generateBlogPost = async (params: BlogGenerationRequest) => {
  const response = await api.post('/api/posts/generate', params);
  return response.data;
};
```

## Error Handling and Monitoring

### Backend Logging

```python
import logging
from functools import wraps

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def log_error(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {func.__name__}: {str(e)}")
            raise
    return wrapper
```

### Frontend Error Boundary

```typescript
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## Performance Optimization

### Caching Strategy

```python
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache

@cache(expire=300)
async def get_cached_data(key: str):
    # Expensive operation here
    pass
```

### Rate Limiting

```python
from fastapi import FastAPI, Request
from fastapi.middleware.throttling import ThrottlingMiddleware

app = FastAPI()
app.add_middleware(
    ThrottlingMiddleware,
    rate_limit=1000,
    time_window=60
)
``` 