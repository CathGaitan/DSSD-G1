from sqlalchemy.orm import Session
from app.repositories.ong_repository import OngRepository
from app.schemas.ong_schema import OngCreate, OngResponse

class OngService:
    def __init__(self, db: Session):
        self.ong_repo = OngRepository(db)

    def get_ongs(self) -> list[OngResponse]:
        return self.ong_repo.get_all()

    def create_ong(self, ong_data: OngCreate) -> OngResponse:
        ong_dict = ong_data.model_dump()
        return self.ong_repo.create(ong_dict)
