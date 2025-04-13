from sqlalchemy.orm import Session
from db.database import User
from typing import Optional

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def create_user(self, email: str, hashed_password: str) -> User:
        user = User(email=email, hashed_password=hashed_password)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_user_password(self, email: str, hashed_password: str) -> Optional[User]:
        user = self.get_user_by_email(email)
        if user:
            user.hashed_password = hashed_password
            self.db.commit()
            self.db.refresh(user)
        return user

    def disable_user(self, email: str) -> Optional[User]:
        user = self.get_user_by_email(email)
        if user:
            user.disabled = True
            self.db.commit()
            self.db.refresh(user)
        return user 