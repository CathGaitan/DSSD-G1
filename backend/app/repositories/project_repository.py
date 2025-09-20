from typing import Optional
from sqlalchemy.orm import Session

from models.project import Project
from repositories.base_repository import BaseRepository


class ProjectRepository(BaseRepository[Project]):
    def __init__(self, db: Session):
        super().__init__(db, Project)

    def get_by_name(self, name: str) -> Optional[Project]:
        """Buscar proyecto por nombre exacto"""
        return self.db.query(Project).filter(Project.name == name).first()
