import pytest
from src.repositories.blog_repository import BlogRepository
from src.models.blog_post import BlogPost
from datetime import datetime

@pytest.mark.asyncio
async def test_create_blog_post():
    """Test creating a blog post."""
    repo = BlogRepository()
    post = BlogPost(
        title="Test Post",
        content="Test Content",
        slug="test-post",
        status="draft"
    )
    created_post = await repo.create(post)
    assert created_post.id is not None
    assert created_post.title == "Test Post"
    assert created_post.status == "draft"

@pytest.mark.asyncio
async def test_get_blog_post():
    """Test getting a blog post."""
    repo = BlogRepository()
    post = BlogPost(
        title="Test Post",
        content="Test Content",
        slug="test-post",
        status="draft"
    )
    created_post = await repo.create(post)
    retrieved_post = await repo.get(created_post.id)
    assert retrieved_post is not None
    assert retrieved_post.title == "Test Post"

@pytest.mark.asyncio
async def test_list_blog_posts():
    """Test listing blog posts."""
    repo = BlogRepository()
    posts = await repo.list(limit=10)
    assert isinstance(posts, list)
    assert len(posts) <= 10 