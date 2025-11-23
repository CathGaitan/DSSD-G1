from app.repositories.base_repository import BaseRepository
from typing import List
from app.models.observation import Observation
from app.models.project import Project


class ObservationRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Observation)

    def get_by_ong_ids(self, ong_ids: List[int]) -> List[Observation]:
        if not ong_ids:
            return []
        return (
            self.db.query(Observation)
            .join(Project, Observation.project_id == Project.id)
            .filter(Project.owner_id.in_(ong_ids))
            .order_by(Observation.created_at.desc())
            .all()
        )