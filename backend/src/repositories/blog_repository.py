from typing import List, Optional
from ..models.blog_post import BlogPost
from ..core.firebase import get_firestore_client

class BlogRepository:
    def __init__(self):
        self.db = get_firestore_client()
        self.collection = self.db.collection('blog_posts')

    async def create(self, post: BlogPost) -> BlogPost:
        doc_ref = self.collection.document()
        post.id = doc_ref.id
        doc_ref.set(post.dict())  # Firestore set is synchronous
        return post

    async def get(self, post_id: str) -> Optional[BlogPost]:
        doc = self.collection.document(post_id).get()  # Firestore get is synchronous
        if doc.exists:
            return BlogPost(**doc.to_dict())
        return None

    async def list(self, limit: int = 10, status: Optional[str] = None) -> List[BlogPost]:
        query = self.collection.limit(limit)
        if status:
            query = query.where('status', '==', status)
        docs = query.get()  # Firestore get is synchronous
        return [BlogPost(**doc.to_dict()) for doc in docs]

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