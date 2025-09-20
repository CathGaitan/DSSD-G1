from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from backend.app.core.database import Base, get_db

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)