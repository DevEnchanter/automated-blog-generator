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
        await doc_ref.set(post.dict())
        return post

    async def get(self, post_id: str) -> Optional[BlogPost]:
        doc = await self.collection.document(post_id).get()
        if doc.exists:
            return BlogPost(**doc.to_dict())
        return None

    async def list(self, limit: int = 10, status: Optional[str] = None) -> List[BlogPost]:
        query = self.collection.limit(limit)
        if status:
            query = query.where('status', '==', status)
        docs = await query.get()
        return [BlogPost(**doc.to_dict()) for doc in docs]

    async def update(self, post_id: str, post: BlogPost) -> Optional[BlogPost]:
        doc_ref = self.collection.document(post_id)
        doc = await doc_ref.get()
        if not doc.exists:
            return None
        await doc_ref.update(post.dict(exclude={'id'}))
        return post

    async def delete(self, post_id: str) -> bool:
        doc_ref = self.collection.document(post_id)
        doc = await doc_ref.get()
        if not doc.exists:
            return False
        await doc_ref.delete()
        return True 