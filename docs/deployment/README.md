# Deployment Guide

## Overview

This guide covers the deployment process for both frontend and backend components of the Automated Blog Generator using Vercel's platform.

## Prerequisites

1. **Accounts Required**
   - Vercel account
   - GitHub account
   - Google Cloud Platform account
   - Firebase account

2. **Required Tools**
   - Node.js 16+
   - Python 3.8+
   - Vercel CLI
   - Firebase CLI

## Environment Setup

### 1. Google Cloud Setup
```bash
# Install and initialize Google Cloud SDK
gcloud init
gcloud services enable aiplatform.googleapis.com

# Configure Gemini API
gcloud auth application-default login
```

### 2. Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init
```

## Environment Variables

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=your_api_url
```

### Backend (.env)
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
GOOGLE_CLOUD_PROJECT=your_project_id
GEMINI_API_KEY=your_gemini_api_key
```

## Vercel Configuration

### Frontend Configuration (vercel.json)
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

### Backend Configuration (vercel.json)
```json
{
  "builds": [
    {
      "src": "backend/src/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/main.py"
    }
  ]
}
```

## Deployment Steps

### Frontend Deployment

1. **Connect to Vercel**
   ```bash
   cd frontend
   vercel login
   vercel link
   ```

2. **Configure Environment Variables**
   ```bash
   vercel env add VITE_FIREBASE_API_KEY
   vercel env add VITE_FIREBASE_AUTH_DOMAIN
   # Add remaining environment variables
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Backend Deployment

1. **Connect to Vercel**
   ```bash
   cd backend
   vercel login
   vercel link
   ```

2. **Configure Environment Variables**
   ```bash
   vercel env add FIREBASE_PROJECT_ID
   vercel env add FIREBASE_PRIVATE_KEY
   # Add remaining environment variables
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## Post-Deployment Setup

### 1. Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. CORS Configuration
Configure CORS in your FastAPI application:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Domain Configuration
1. Add custom domain in Vercel dashboard
2. Configure DNS settings
3. Update environment variables with new domain

## Monitoring & Maintenance

### Frontend Monitoring
- Vercel Analytics dashboard
- Firebase Analytics
- Error tracking via Sentry

### Backend Monitoring
- Vercel function logs
- Firebase Monitoring
- Custom logging implementation

## Security Checklist

- [ ] Environment variables configured
- [ ] Firebase security rules implemented
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] SSL/TLS enabled
- [ ] Authentication working
- [ ] Error logging configured

## Troubleshooting

### Common Issues

1. **Deployment Failures**
   - Check build logs in Vercel dashboard
   - Verify environment variables
   - Check Python/Node.js versions

2. **API Connection Issues**
   - Verify CORS configuration
   - Check API URL in frontend
   - Verify authentication flow

3. **Performance Issues**
   - Check function execution times
   - Monitor API rate limits
   - Review database queries

## Rollback Procedure

1. **Frontend Rollback**
   ```bash
   vercel rollback
   ```

2. **Backend Rollback**
   ```bash
   vercel rollback
   ```

## Backup Procedures

1. **Database Backup**
   - Regular Firestore exports
   - Backup environment variables
   - Document version control

2. **Configuration Backup**
   - Version control for config files
   - Regular environment variable exports
   - Documentation updates 