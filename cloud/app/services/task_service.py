from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemas.task_schema import TaskCreate
from app.services.ong_service import OngService
from app.repositories.task_repository import TaskRepository


class TaskService:
    def __init__(self, db: Session):
        self.task_repo = TaskRepository(db)
        self.ong_service = OngService(db)

    def verify_task_id_exists(self, task_id: int) -> None:
        id_task = self.task_repo.get_by_id(task_id)
        if not id_task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No existe una tarea con id={task_id}.",)

    def commit_task_to_ong(self, task_id: int, ong_id: int):
        from app.services.project_service import ProjectService
        self.project_service = ProjectService(self.task_repo.db)

        self.ong_service.verify_ong_id_exists(ong_id)
        self.verify_task_id_exists(task_id)
        task = self.task_repo.get_by_id(task_id)
        data = self.task_repo.commit_task_to_ong(task_id, ong_id)
        if self.project_service.all_tasks_have_ong(task.project.name):
            project = task.project
            self.project_service.update_status(project, "waiting")
        return data

    def select_ong_for_task(self, task_id: int, ong_id: int):
        self.ong_service.verify_ong_id_exists(ong_id)
        self.verify_task_id_exists(task_id)
        if not self.task_repo.has_ong_applied_for_task(task_id, ong_id):
            raise ValueError("La ONG no se ha postulado para esta tarea.")
        return self.task_repo.select_ong_for_task(task_id, ong_id)

    def process_and_save_tasks(self, tasks: list[TaskCreate], project_id: int) -> list[dict]:
        tasks_data = self._prepare_tasks_data(tasks, project_id)
        return self.task_repo.create_multiple_tasks(tasks_data)

    def _prepare_tasks_data(self, tasks: list[TaskCreate], project_id: int) -> list[dict]:
        """Convierte las tareas a dict y agrega el project_id"""
        return [
            {**task.model_dump(), "project_id": project_id}
            for task in tasks
        ]

    def has_ong_association(self, task_id: int) -> bool:
        return self.task_repo.has_ong_association(task_id)

    def get_ong_association(self, task_id: int):
        return self.task_repo.get_ong_association(task_id)
