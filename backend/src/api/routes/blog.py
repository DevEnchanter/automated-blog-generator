from fastapi import APIRouter, Depends, HTTPException, Response, Request
from typing import List, Optional
from pydantic import BaseModel
from ...models.blog_post import BlogPost
from ...services.gemini_service import GeminiService
from ...repositories.blog_repository import BlogRepository
import logging

router = APIRouter(prefix="/api/blogs", tags=["blog"])
blog_repo = BlogRepository()
gemini_service = GeminiService()
logger = logging.getLogger(__name__)

class BlogGenerationRequest(BaseModel):
    topic: str
    keywords: List[str]
    tone: str = "professional"
    length: str = "medium"
    target_audience: str = "general"

@router.options("/generate")
async def options_generate():
    """Handle OPTIONS request for generate endpoint."""
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Max-Age": "3600",
        }
    )

@router.post("/", response_model=BlogPost)
async def create_post(post: BlogPost):
    """Create a new blog post."""
    try:
        logger.info(f"Creating blog post: {post.dict()}")
        created_post = await blog_repo.create(post)
        logger.info(f"Blog post created successfully: {created_post.id}")
        return created_post
    except Exception as e:
        logger.error(f"Failed to create blog post: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/{post_id}", response_model=BlogPost)
async def get_post(post_id: str):
    """Get a blog post by ID."""
    post = await blog_repo.get(post_id)
    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )
    return post

@router.get("/", response_model=List[BlogPost])
async def list_posts(
    limit: int = 10, 
    status: Optional[str] = None,
    author_id: Optional[str] = None
):
    """List blog posts with optional filtering."""
    try:
        logger.info(f"Fetching posts with filters - author_id: {author_id}, status: {status}")
        return await blog_repo.list(limit=limit, status=status, author_id=author_id)
    except Exception as e:
        logger.error(f"Failed to list posts: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.put("/{post_id}", response_model=BlogPost)
async def update_post(post_id: str, post: BlogPost):
    """Update a blog post."""
    updated_post = await blog_repo.update(post_id, post)
    if not updated_post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )
    return updated_post

@router.delete("/{post_id}")
async def delete_post(post_id: str):
    """Delete a blog post."""
    success = await blog_repo.delete(post_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )
    return {"message": "Post deleted successfully"}

@router.post("/generate", response_model=BlogPost)
async def generate_post(request: BlogGenerationRequest):
    """Generate a blog post using Gemini API."""
    try:
        content = await gemini_service.generate_blog_post(
            topic=request.topic,
            keywords=request.keywords,
            tone=request.tone,
            length=request.length,
            target_audience=request.target_audience
        )
        meta_description = await gemini_service.generate_meta_description(content)
        slug = await gemini_service.generate_slug(request.topic)
        
        # Create a new blog post with the generated content
        blog_post = BlogPost(
            title=request.topic,
            content=content,
            slug=slug,
            author_id="system",  # Default author for generated posts
            status="draft",
            tags=request.keywords,
            meta_description=meta_description
        )
        
        # Save the blog post to the database
        return await blog_repo.create(blog_post)
    except Exception as e:
        logger.error(f"Failed to generate blog post: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate blog post: {str(e)}"
        )

@router.get("/me", response_model=List[BlogPost])
async def get_my_posts(limit: int = 10, status: Optional[str] = None):
    """Get the current user's blog posts."""
    try:
        # TODO: Get current user ID from auth context
        current_user_id = "current-user"  # Temporary until auth is implemented
        logger.info(f"Fetching posts for user: {current_user_id}")
        posts = await blog_repo.list_by_author(current_user_id, limit=limit, status=status)
        logger.info(f"Found {len(posts)} posts for user {current_user_id}")
        return posts
    except Exception as e:
        logger.error(f"Failed to fetch user's blog posts: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        ) 