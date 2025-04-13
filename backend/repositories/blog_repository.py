from sqlalchemy.orm import Session
from db.database import Blog
from typing import List, Optional
from datetime import datetime

class BlogRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_blog_by_id(self, blog_id: int) -> Optional[Blog]:
        return self.db.query(Blog).filter(Blog.id == blog_id).first()

    def get_blogs_by_author(self, author_id: int) -> List[Blog]:
        return self.db.query(Blog).filter(Blog.author_id == author_id).all()

    def create_blog(self, title: str, content: str, author_id: int) -> Blog:
        blog = Blog(
            title=title,
            content=content,
            author_id=author_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.db.add(blog)
        self.db.commit()
        self.db.refresh(blog)
        return blog

    def update_blog(self, blog_id: int, title: str = None, content: str = None, status: str = None) -> Optional[Blog]:
        blog = self.get_blog_by_id(blog_id)
        if blog:
            if title:
                blog.title = title
            if content:
                blog.content = content
            if status:
                blog.status = status
            blog.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(blog)
        return blog

    def delete_blog(self, blog_id: int) -> bool:
        blog = self.get_blog_by_id(blog_id)
        if blog:
            self.db.delete(blog)
            self.db.commit()
            return True
        return False

    def increment_views(self, blog_id: int) -> Optional[Blog]:
        blog = self.get_blog_by_id(blog_id)
        if blog:
            blog.views += 1
            self.db.commit()
            self.db.refresh(blog)
        return blog 