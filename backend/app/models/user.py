from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.user_ong import user_ongs


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    hashed_password = Column(String(128), nullable=False)

    ongs = relationship("Ong", secondary=user_ongs, back_populates="users")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"