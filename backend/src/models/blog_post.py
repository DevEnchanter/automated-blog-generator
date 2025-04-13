from typing import List, Optional
from datetime import datetime
from .base import FirestoreDocument

class BlogPost(FirestoreDocument):
    """Model for blog posts."""
    title: str
    content: str
    slug: str
    author_id: str
    status: str = "draft"  # draft, published, archived
    tags: List[str] = []
    category: Optional[str] = None
    featured_image: Optional[str] = None
    meta_description: Optional[str] = None
    published_at: Optional[datetime] = None
    views: int = 0

    class Config:
        """Pydantic config."""
        from_attributes = True 