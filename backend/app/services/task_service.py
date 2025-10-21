from sqlalchemy.orm import Session
from app.repositories.task_repository import TaskRepository
from app.schemas.task_schema import TaskCreate


class TaskService:
    def __init__(self, db: Session):
        self.task_repo = TaskRepository(db)

    def process_tasks(self, tasks: list[TaskCreate], project_id: int, owner_id: int) -> tuple[list[dict], list[dict]]:
        """
        Procesa las tareas: guarda las tareas locales en DB local y
        retorna las que deben ir en cloud (bonita).

        Returns:
            Tupla con (tareas_locales, tareas_cloud)
        """
        tasks_data = self._prepare_tasks_data(tasks, project_id)
        local_tasks = [t for t in tasks_data if t["resolves_by_itself"]]
        cloud_tasks = [t for t in tasks_data if not t["resolves_by_itself"]]

        if local_tasks:
            self.task_repo.save_tasks_with_ong(local_tasks, owner_id)

        return local_tasks, cloud_tasks

    def _prepare_tasks_data(self, tasks: list[TaskCreate], project_id: int) -> list[dict]:
        """Convierte las tareas a dict y agrega el project_id"""
        return [
            {**task.model_dump(), "project_id": project_id}
            for task in tasks
        ]
