from app.schemas.task_schema import TaskCreate
from sqlalchemy.orm import Session
from app.repositories.task_repository import TaskRepository


class TaskService:
    def __init__(self, db: Session):
        self.task_repo = TaskRepository(db)

    def process_and_save_tasks(self, tasks: list[TaskCreate], project_id: int) -> list[dict]:
        tasks_data = self._prepare_tasks_data(tasks, project_id)
        return self.task_repo.create_multiple_tasks(tasks_data)

    def _prepare_tasks_data(self, tasks: list[TaskCreate], project_id: int) -> list[dict]:
        """Convierte las tareas a dict y agrega el project_id"""
        return [
            {**task.model_dump(), "project_id": project_id}
            for task in tasks
        ]