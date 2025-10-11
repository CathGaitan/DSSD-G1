from app.repositories.base_repository import BaseRepository
from app.models.ong import Ong

class OngRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Ong)