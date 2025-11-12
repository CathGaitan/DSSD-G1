from sqlalchemy.orm import Session
from fastapi import HTTPException, status
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

    def get_ong_by_name(self, name: str) -> OngResponse | None:
        return self.ong_repo.get_by_name(name)

    def get_ong_by_id(self, ong_id: int) -> OngResponse | None:
        ong = self.ong_repo.get_by_id(ong_id)
        if not ong:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No existe una ONG con id={ong_id}.",)
        return ong

    def verify_ong_exists(self, ong_id: int, name: str) -> None:
        ong_by_id = self.ong_repo.get_by_id(ong_id)
        ong_by_name = self.ong_repo.get_by_name(name)
        if not ong_by_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No existe una ONG con id={ong_id}.",)
        if not ong_by_name:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No existe una ONG con nombre='{name}'.")
        if ong_by_id.id != ong_by_name.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"El id={ong_id} no corresponde a la ONG con nombre='{name}'.")