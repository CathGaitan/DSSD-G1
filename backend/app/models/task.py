from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.task_ong import task_ongs


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    necessity = Column(Text, nullable=False)
    quantity = Column(String(100), nullable=False)
    resolves_by_itself = Column(Boolean, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    project = relationship("Project", back_populates="tasks")
    ongs = relationship("Ong", secondary=task_ongs, back_populates="tasks")
