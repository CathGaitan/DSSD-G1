from app.models.project import Project
from app.repositories.base_repository import BaseRepository


class ProjectRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Project)
