# API Documentation

## Overview

This API documentation covers the endpoints available in our FastAPI backend, deployed as serverless functions on Vercel.

## Base URLs

- Development: `http://localhost:8000`
- Production: `https://your-app.vercel.app/api`

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

## Rate Limiting

- Development: 1000 requests per minute
- Production: Configured via Vercel

## Endpoints

### Authentication

#### GET /api/auth/me
Get current user profile
- Requires: Authentication
- Returns: User profile object

### Blog Posts

#### POST /api/posts/generate
Generate a new blog post using Gemini API
- Requires: Authentication
- Body:
  ```json
  {
    "title": "string",
    "topic": "string",
    "keywords": ["string"],
    "tone": "string",
    "length": "string"
  }
  ```
- Returns: Generated blog post content

#### GET /api/posts
List blog posts with pagination and filters
- Requires: Authentication
- Query Parameters:
  - page: int (default: 1)
  - limit: int (default: 10)
  - status: "draft" | "published" | "archived"
  - category: string
  - tag: string
  - search: string
- Returns: Paginated list of posts

#### GET /api/posts/{post_id}
Get single post by ID
- Requires: Authentication
- Returns: Complete post object with author details

#### PUT /api/posts/{post_id}
Update existing post
- Requires: Authentication
- Body:
  ```json
  {
    "title": "string",
    "content": "string",
    "status": "draft" | "published" | "archived",
    "category": "string",
    "tags": ["string"]
  }
  ```
- Returns: Updated post object

#### DELETE /api/posts/{post_id}
Delete post by ID
- Requires: Authentication
- Returns: Success message

### Categories

#### GET /api/categories
List all categories
- Public endpoint
- Returns: Array of categories with post counts

#### POST /api/categories
Create new category
- Requires: Admin authentication
- Body:
  ```json
  {
    "name": "string",
    "description": "string",
    "slug": "string"
  }
  ```
- Returns: Created category object

### Tags

#### GET /api/tags
List all tags with usage statistics
- Public endpoint
- Query Parameters:
  - search: string
  - limit: int
- Returns: Array of tags with post counts

#### POST /api/tags
Create new tag
- Requires: Authentication
- Body:
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
- Returns: Created tag object

### Analytics

#### GET /api/analytics/posts
Get post analytics and performance metrics
- Requires: Authentication
- Query Parameters:
  - start_date: string (ISO format)
  - end_date: string (ISO format)
  - post_id: string (optional)
- Returns: Analytics data including:
  - View counts
  - Time spent reading
  - Engagement metrics
  - Generation statistics

## Response Format

All responses follow this format:
```json
{
  "success": boolean,
  "data": object | null,
  "error": {
    "code": string,
    "message": string,
    "details": object | null
  } | null,
  "meta": {
    "timestamp": string,
    "request_id": string,
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "total_pages": number
    } | null
  }
}
```

## Error Codes

- 400: Bad Request - Invalid input or parameters
- 401: Unauthorized - Missing or invalid authentication
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource doesn't exist
- 429: Too Many Requests - Rate limit exceeded
- 500: Internal Server Error - Server-side error

## Development Tools

- Interactive API Documentation: Available at `/docs` in development
- OpenAPI Specification: Available at `/openapi.json`
- Swagger UI: Available at `/docs` in development
- Postman Collection: Available in `/docs/api/postman/`

## Best Practices

1. Always include authentication token for protected endpoints
2. Use proper HTTP methods for operations
3. Include proper error handling in clients
4. Implement retry logic for network failures
5. Cache responses when appropriate
6. Handle rate limiting with exponential backoff
7. Validate input before sending requests
8. Handle pagination properly

## Versioning

Current API version: v1
- All endpoints prefixed with /api/v1/
- Breaking changes will increment version number
- Deprecation notices will be provided
- Multiple versions may be supported simultaneously

## Testing

- Test environment: `http://localhost:8000`
- Test credentials available in development
- Postman collection available in `/docs/api/postman`
- Integration tests available in `/backend/tests/api/`

## Monitoring

- Request logging enabled in production
- Performance metrics tracked
- Error tracking via Vercel
- Rate limit monitoring
- API usage analytics 