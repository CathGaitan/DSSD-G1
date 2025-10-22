from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    necessity = Column(Text, nullable=False)
    quantity = Column(String(100), nullable=False)
    resolves_by_itself = Column(Boolean, nullable=False)
    status = Column(String(50), nullable=False, default="pending")
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    project = relationship("Project", back_populates="tasks")
    ong_associations = relationship("TaskOngAssociation", back_populates="task")
