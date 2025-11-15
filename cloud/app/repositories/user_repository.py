from typing import Optional
from app.models.user import User 
from app.repositories.base_repository import BaseRepository
from app.models.ong import Ong


class UserRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, User)

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_username(self, username: str) -> Optional[User]:
        return self.db.query(User).filter(User.username == username).first()