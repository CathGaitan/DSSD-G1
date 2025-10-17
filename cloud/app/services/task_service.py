from sqlalchemy.orm import Session
from app.repositories.task_repository import TaskRepository


class TaskService:
    def __init__(self, db: Session):
        self.task_repo = TaskRepository(db)
