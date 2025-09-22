from sqlalchemy.orm import Session
from app.repositories.project_repository import ProjectRepository
from app.schemas.project_schema import ProjectCreate, ProjectResponse


class ProjectService:
    def __init__(self, db: Session):
        self.repo = ProjectRepository(db)

    def get_project(self, project_id: int) -> ProjectResponse | None:
        return self.repo.get_by_id(project_id)

    def create_project(self, project_data: ProjectCreate) -> ProjectResponse:
        return self.repo.create(project_data.dict())
