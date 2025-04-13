from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class FirestoreDocument(BaseModel):
    """Base model for Firestore documents."""
    id: Optional[str] = Field(None, description="Document ID")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        """Pydantic configuration."""
        from_attributes = True
        populate_by_name = True
        arbitrary_types_allowed = True

    def to_dict(self) -> Dict[str, Any]:
        """Convert model to dictionary for Firestore."""
        data = self.model_dump(exclude={'id'})
        data['created_at'] = data['created_at'].isoformat()
        data['updated_at'] = data['updated_at'].isoformat()
        return data

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'FirestoreDocument':
        """Create model from Firestore dictionary."""
        if 'created_at' in data:
            data['created_at'] = datetime.fromisoformat(data['created_at'])
        if 'updated_at' in data:
            data['updated_at'] = datetime.fromisoformat(data['updated_at'])
        return cls(**data) 