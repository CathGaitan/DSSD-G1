from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.ong_service import OngService
from app.schemas.ong_schema import OngResponse, OngCreate

router = APIRouter()

@router.get("/", response_model=list[OngResponse])
def get_ongs(db: Session = Depends(get_db)):
    service = OngService(db)
    return service.get_ongs()

@router.post("/", response_model=OngResponse)
def create_ong(ong_data: OngCreate, db: Session = Depends(get_db)):
    service = OngService(db)
    return service.create_ong(ong_data)