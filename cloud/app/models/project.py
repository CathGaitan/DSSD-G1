from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    owner_id = Column(Integer, ForeignKey("ongs.id"), nullable=False)
    ong_responsable = relationship("Ong", back_populates="project_ong")
    status = Column(String(50), nullable=False, default="active")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
