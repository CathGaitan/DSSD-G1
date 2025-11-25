from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.stats_schema import StatsResponse
from app.services.stats_service import StatsService
from app.schemas.user_schema import UserResponse
from app.services.auth_service import get_current_user

router = APIRouter()

@router.get("/dashboard-kpis", response_model=StatsResponse)
def get_total_statistics(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        service = StatsService(db)
        return service.get_total_stats(current_user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))