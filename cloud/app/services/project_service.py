from app.repositories.project_repository import ProjectRepository
from sqlalchemy.orm import Session
from app.schemas.project_schema import ProjectResponse


class ProjectService:
    def __init__(self, db: Session):
        self.project_repo = ProjectRepository(db)

    def get_projects(self) -> list[ProjectResponse]:
        return self.project_repo.get_all()
