from app.services.auth_service import get_current_user
from app.schemas.user_schema import UserResponse
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
def create_ong(ong_data: OngCreate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    service = OngService(db)
    return service.create_ong(ong_data)


@router.get("/{ong_id}/emails")
def get_ong_emails(ong_id: int, db: Session = Depends(get_db)):
    service = OngService(db)
    return service.get_user_emails_for_ong(ong_id)
