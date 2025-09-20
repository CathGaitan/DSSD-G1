from typing import Optional, Tuple
from repositories.project_repository import ProjectRepository
from schemas.project import ProjectCreate, ProjectResponse


class ProjectService:
    def __init__(self, project_repository: ProjectRepository):
        self.project_repository = project_repository

    def create_project(self, project_data: ProjectCreate) -> ProjectResponse:
        """Crear un nuevo proyecto"""
        db_project = self.project_repository.create(project_data.dict())
        return ProjectResponse.from_orm(db_project)