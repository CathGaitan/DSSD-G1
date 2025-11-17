from app.models.project import Project
from app.repositories.base_repository import BaseRepository
from typing import List


class ProjectRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Project)
    
    def get_by_status(self, status: str) -> list[Project]:
        return self.db.query(self.model).filter(self.model.status == status).all()

    def get_projects_by_owner_ids(self, owner_ids: List[int]) -> list[Project]:
        if not owner_ids:
            return []
        return self.db.query(self.model).filter(self.model.owner_id.in_(owner_ids)).all()