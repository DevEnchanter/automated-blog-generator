from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from ...models.blog_post import BlogPost
from ...services.gemini_service import GeminiService
from ...repositories.blog_repository import BlogRepository

router = APIRouter(prefix="/api/posts", tags=["blog"])
blog_repo = BlogRepository()
gemini_service = GeminiService()

@router.post("/", response_model=BlogPost)
async def create_post(post: BlogPost):
    """Create a new blog post."""
    try:
        return await blog_repo.create(post)
    except Exception as e:
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
async def list_posts(limit: int = 10, status: Optional[str] = None):
    """List blog posts with optional filtering."""
    try:
        return await blog_repo.list(limit=limit, status=status)
    except Exception as e:
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
async def generate_post(
    topic: str,
    keywords: List[str],
    tone: str = "professional",
    length: str = "medium"
):
    """Generate a blog post using Gemini API."""
    try:
        content = await gemini_service.generate_blog_post(
            topic=topic,
            keywords=keywords,
            tone=tone,
            length=length
        )
        meta_description = await gemini_service.generate_meta_description(content)
        slug = await gemini_service.generate_slug(topic)
        
        post = BlogPost(
            title=topic,
            content=content,
            meta_description=meta_description,
            slug=slug,
            status="draft"
        )
        return await blog_repo.create(post)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        ) 