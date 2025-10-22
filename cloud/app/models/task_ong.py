from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


class TaskOngAssociation(Base):
    __tablename__ = "task_ongs"

    task_id = Column(Integer, ForeignKey("tasks.id"), primary_key=True)
    ong_id = Column(Integer, ForeignKey("ongs.id"), primary_key=True)
    status = Column(String(50), nullable=False, default="interested")
    selected_at = Column(DateTime, nullable=True)

    task = relationship("Task", back_populates="ong_associations")
    ong = relationship("Ong", back_populates="task_associations")
