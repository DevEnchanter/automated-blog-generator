from typing import List, Optional
from ..models.blog_post import BlogPost
from ..core.firebase import get_firestore_client
import logging

logger = logging.getLogger(__name__)

class BlogRepository:
    def __init__(self):
        self.db = get_firestore_client()
        self.collection = self.db.collection('blog_posts')

    async def create(self, post: BlogPost) -> BlogPost:
        logger.info(f"Creating blog post with title: {post.title}")
        doc_ref = self.collection.document()
        post.id = doc_ref.id
        doc_ref.set(post.dict())  # Firestore set is synchronous
        logger.info(f"Blog post created with ID: {post.id}")
        return post

    async def get(self, post_id: str) -> Optional[BlogPost]:
        doc = self.collection.document(post_id).get()  # Firestore get is synchronous
        if doc.exists:
            return BlogPost(**doc.to_dict())
        return None

    async def list(self, limit: int = 10, status: Optional[str] = None, author_id: Optional[str] = None) -> List[BlogPost]:
        """List blog posts with optional filtering."""
        logger.info(f"Listing posts with filters - author_id: {author_id}, status: {status}")
        query = self.collection.limit(limit)
        
        if author_id:
            query = query.where('author_id', '==', author_id)
            logger.info(f"Added author_id filter: {author_id}")
            
        if status:
            query = query.where('status', '==', status)
            logger.info(f"Added status filter: {status}")
            
        docs = query.get()
        posts = [BlogPost(**doc.to_dict()) for doc in docs]
        logger.info(f"Found {len(posts)} posts")
        return posts

    async def update(self, post_id: str, post: BlogPost) -> Optional[BlogPost]:
        doc_ref = self.collection.document(post_id)
        doc = doc_ref.get()  # Firestore get is synchronous
        if not doc.exists:
            return None
        doc_ref.update(post.dict(exclude={'id'}))  # Firestore update is synchronous
        return post

    async def delete(self, post_id: str) -> bool:
        doc_ref = self.collection.document(post_id)
        doc = doc_ref.get()  # Firestore get is synchronous
        if not doc.exists:
            return False
        doc_ref.delete()  # Firestore delete is synchronous
        return True

    async def list_by_author(self, author_id: str, limit: int = 10, status: Optional[str] = None) -> List[BlogPost]:
        """List blog posts by author with optional status filtering."""
        logger.info(f"Fetching blogs for author: {author_id}, status: {status}")
        query = self.collection.where('author_id', '==', author_id).limit(limit)
        if status:
            query = query.where('status', '==', status)
        docs = query.get()  # Firestore get is synchronous
        posts = [BlogPost(**doc.to_dict()) for doc in docs]
        logger.info(f"Found {len(posts)} blog posts")
        return posts 