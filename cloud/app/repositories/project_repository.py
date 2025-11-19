from app.repositories.base_repository import BaseRepository
from app.models.project import Project
from typing import List


class ProjectRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Project)

    def get_project_by_name(self, name: str):
        return self.db.query(Project).filter(Project.name == name).first()

    def get_by_status(self, status: str) -> list[Project]:
        return self.db.query(self.model).filter(self.model.status == status).all()

    def get_projects_not_owned_by_and_active(self, owner_ids: List[int]) -> list[Project]:
        return self.db.query(self.model).filter(
            self.model.owner_id.notin_(owner_ids),
            self.model.status == "active"
        ).all()
