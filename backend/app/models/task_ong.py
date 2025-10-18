from sqlalchemy import Table, Column, Integer, ForeignKey
from app.core.database import Base

task_ongs = Table(
    "task_ongs",
    Base.metadata,
    Column("task_id", Integer, ForeignKey("tasks.id"), primary_key=True),
    Column("ong_id", Integer, ForeignKey("ongs.id"), primary_key=True)
)
