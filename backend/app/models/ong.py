from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class Ong(Base):
    __tablename__ = "ongs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    project_ong = relationship("Project", back_populates="ong_responsable", cascade="all, delete-orphan")
    users = relationship("User", secondary="user_ongs", back_populates="ongs")
