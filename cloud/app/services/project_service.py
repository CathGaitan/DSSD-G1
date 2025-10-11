from sqlalchemy.orm import Session
from app.repositories.project_repository import ProjectRepository
from app.repositories.task_repository import TaskRepository
from app.schemas.project_schema import ProjectCreate, ProjectResponse
import time


class ProjectService:
    def __init__(self, db: Session):
        self.project_repo = ProjectRepository(db)
        self.task_repo = TaskRepository(db)
        self.process_name = "Proceso de gestion de proyecto"
        self.bonita = BonitaClient()

    def get_project(self, project_id: int) -> ProjectResponse | None:
        return self.project_repo.get_by_id(project_id)

    def create_project(self, project_data: ProjectCreate) -> ProjectResponse:
        try:
            project_dict = project_data.model_dump(exclude={"tasks"})
            project = self.project_repo.create(project_dict)
            tasks_data = self._prepare_tasks_data(project_data.tasks, project.id)
            self.task_repo.create_multiple_tasks(tasks_data)
            return project
        except Exception:
            self.project_repo.db.rollback()
            raise

    def _prepare_tasks_data(self, tasks: list, project_id: int) -> list[dict]:
        tasks_data = []
        for task in tasks:
            task_dict = task.model_dump()
            task_dict["project_id"] = project_id
            tasks_data.append(task_dict)
        return tasks_data
