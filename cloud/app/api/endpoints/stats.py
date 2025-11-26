from app.services.auth_service import get_current_user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.ong_service import OngService
from app.schemas.user_schema import UserResponse


router = APIRouter()

@router.get("/ongs-and-collaborations", response_model=list)
def get_ongs_and_collaborations(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    ong_service = OngService(db)
    return ong_service.get_ongs_and_collaborations()