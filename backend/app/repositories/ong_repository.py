from app.repositories.base_repository import BaseRepository
from app.models.ong import Ong


class OngRepository(BaseRepository):
    def __init__(self, db):
        super().__init__(db, Ong)

    def get_by_name(self, name: str) -> Ong | None:
        return self.db.query(Ong).filter(Ong.name == name).one_or_none()
