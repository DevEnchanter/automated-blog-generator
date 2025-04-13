from typing import Optional, List
from datetime import datetime
from .base import FirestoreDocument

class User(FirestoreDocument):
    """Model for users."""
    email: str
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    role: str = "user"  # user, admin
    is_active: bool = True
    last_login: Optional[datetime] = None
    permissions: List[str] = []
    
    class Config:
        """Pydantic config."""
        from_attributes = True 