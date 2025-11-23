from app.repositories.base_repository import BaseRepository
from typing import List
from app.models.observation import Observation
from app.models.project import Project


class ObservationRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Observation)
