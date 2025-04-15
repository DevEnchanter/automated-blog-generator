from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from typing import List, Optional
from pydantic import BaseModel
from ...models.blog_post import BlogPost
from ...services.gemini_service import GeminiService
from ...repositories.blog_repository import BlogRepository
from ..dependencies import get_current_user_or_anonymous, get_current_authenticated_user
import logging

# Define a response model for the generation endpoint
class BlogGenerationResponseData(BaseModel):
    title: str
    content: str
    slug: str
    meta_description: str
    # Add keywords or other relevant generated fields if needed
    tags: List[str] 

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
async def create_post(post: BlogPost, current_user: dict = Depends(get_current_authenticated_user)):
    """Create a new blog post. Requires authenticated user."""
    try:
        user_id = current_user.get('uid')
        if not user_id:
             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not identify user from token")
             
        # Assign the author ID from the authenticated user
        post.author_id = user_id
        
        logger.info(f"User {user_id} creating blog post: {post.dict()}")
        created_post = await blog_repo.create(post)
        logger.info(f"Blog post created successfully: {created_post.id} by user {user_id}")
        return created_post
    except Exception as e:
        logger.error(f"Failed to create blog post for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/test-me")
async def test_me_route():
    logger.info("Accessed /test-me route successfully.")
    return {"message": "Test route for /me endpoint works"}

@router.get("/me", response_model=List[BlogPost])
async def get_my_posts(limit: int = 10, status: Optional[str] = None, current_user: dict = Depends(get_current_authenticated_user)):
    """Get the current authenticated user's blog posts."""
    user_id = current_user.get('uid')
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not identify user from token")
        
    try:
        logger.info(f"Fetching posts for user: {user_id}")
        posts = await blog_repo.list(author_id=user_id, limit=limit, status=status)
        logger.info(f"Found {len(posts)} posts for user {user_id}")
        return posts
    except Exception as e:
        logger.error(f"Failed to fetch user's blog posts for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
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
async def update_post(post_id: str, post_update: BlogPost, current_user: dict = Depends(get_current_authenticated_user)):
    """Update a blog post. Requires authenticated user and ownership."""
    user_id = current_user.get('uid')
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not identify user from token")

    # Check ownership
    existing_post = await blog_repo.get(post_id)
    if not existing_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if existing_post.author_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this post")

    # Ensure the author_id isn't changed via the update payload
    post_update.author_id = user_id 
    # Update the updated_at timestamp (assuming BlogPost model handles this or repository does)
    # post_update.updated_at = datetime.utcnow() 

    try:
        logger.info(f"User {user_id} updating post {post_id}")
        updated_post = await blog_repo.update(post_id, post_update)
        if not updated_post:
             # This case might be redundant due to the check above, but safe to keep
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found during update")
        logger.info(f"Post {post_id} updated successfully by user {user_id}")
        return updated_post
    except Exception as e:
        logger.error(f"Failed to update post {post_id} for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT) # Use 204 No Content
async def delete_post(post_id: str, current_user: dict = Depends(get_current_authenticated_user)):
    """Delete a blog post. Requires authenticated user and ownership."""
    user_id = current_user.get('uid')
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not identify user from token")

    # Check ownership
    existing_post = await blog_repo.get(post_id)
    if not existing_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if existing_post.author_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this post")

    try:
        logger.info(f"User {user_id} deleting post {post_id}")
        success = await blog_repo.delete(post_id)
        if not success:
             # This case might be redundant due to the check above, but safe to keep
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found during deletion")
        logger.info(f"Post {post_id} deleted successfully by user {user_id}")
        return Response(status_code=status.HTTP_204_NO_CONTENT) # Return 204 response
    except Exception as e:
        logger.error(f"Failed to delete post {post_id} for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/generate", response_model=BlogGenerationResponseData)
async def generate_post(request: BlogGenerationRequest, current_user: dict = Depends(get_current_user_or_anonymous)):
    """Generate blog post content using Gemini API. Does NOT save the post."""
    try:
        user_id = current_user.get('uid')
        if not user_id:
             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not identify user from token")

        logger.info(f"User {user_id} generating blog post content for topic: {request.topic}")
        
        # Generate content using the service
        content = await gemini_service.generate_blog_post(
            topic=request.topic,
            keywords=request.keywords,
            tone=request.tone,
            length=request.length,
            target_audience=request.target_audience
        )
        meta_description = await gemini_service.generate_meta_description(content)
        slug = await gemini_service.generate_slug(request.topic)
        
        logger.info(f"Content generated successfully for user {user_id}")

        # Return the generated data without creating a BlogPost object or saving
        return BlogGenerationResponseData(
            title=request.topic, # Use the original topic as title for now
            content=content,
            slug=slug,
            meta_description=meta_description,
            tags=request.keywords # Return keywords used for generation
        )
        
    except Exception as e:
        user_id_for_log = current_user.get('uid', 'unknown') 
        logger.error(f"Failed to generate blog post content for user {user_id_for_log}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate blog post content: {str(e)}"
        ) 