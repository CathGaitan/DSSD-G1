from sqlalchemy.orm import Session
from app.repositories.project_repository import ProjectRepository
from app.repositories.task_repository import TaskRepository
from app.schemas.project_schema import ProjectCreate, ProjectResponse


class ProjectService:
    def __init__(self, db: Session):
        self.project_repo = ProjectRepository(db)
        self.task_repo = TaskRepository(db)

    def get_project(self, project_id: int) -> ProjectResponse | None:
        return self.project_repo.get_by_id(project_id)

    def create_project(self, project_data: ProjectCreate) -> ProjectResponse:
        try:
            project_dict = project_data.model_dump(exclude={"tasks"})
            project = self.project_repo.create(project_dict)
            tasks_data = [{**task.model_dump(), "project_id": project.id} for task in project_data.tasks]
            self.task_repo.create_multiple_tasks(tasks_data)
            return project
        except Exception as e:
            self.project_repo.db.rollback()
            raise e
