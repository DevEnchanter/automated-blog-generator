# API Documentation

## Base URL
`/api/v1`

## Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

## Posts
- GET /api/posts
- POST /api/posts
- GET /api/posts/{id}
- PUT /api/posts/{id}
- DELETE /api/posts/{id}
- POST /api/posts/generate

## Categories
- GET /api/categories
- POST /api/categories
- PUT /api/categories/{id}
- DELETE /api/categories/{id}

## Users
- GET /api/users/me
- PUT /api/users/me
- GET /api/users (admin)
- PUT /api/users/{id} (admin)

## Analytics
- GET /api/analytics/overview
- GET /api/analytics/posts/{id} 