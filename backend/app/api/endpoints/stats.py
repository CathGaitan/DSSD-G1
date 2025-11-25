from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.stats_schema import StatsResponse
from app.services.stats_service import StatsService
from app.schemas.user_schema import UserResponse
from app.services.auth_service import get_current_user

router = APIRouter()

@router.get("/total-kpis", response_model=StatsResponse)
def get_total_statistics(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        service = StatsService(db)
        return service.get_total_stats(current_user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Indicador de Promedio de proyectos exitosos y a tiempo
@router.get("/successful-on-time-avg", response_model=float)
def get_successful_on_time_avg(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        service = StatsService(db)
        return service.get_successful_on_time_avg()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

# Indicador de Porcentaje de proyectos que no necesitaron colaboración de ONG
@router.get("/percent-no-collaboration-needed", response_model=float)
def get_percent_no_collaboration_needed(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        service = StatsService(db)
        return service.get_percent_no_collaboration_needed()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Indicador de Top 3 ONGs más colaborativas
@router.get("/top-3-ongs", response_model=list[StatsResponse])
def get_top_3_ongs(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        service = StatsService(db)
        return service.get_top_3_ongs()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))