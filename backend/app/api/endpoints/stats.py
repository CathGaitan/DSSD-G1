from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.stats_schema import StatsResponse
from app.services.stats_service import StatsService
from app.schemas.user_schema import UserResponse
from app.services.auth_service import get_current_user

router = APIRouter()
    
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
@router.get("/percent-no-collaboration-needed", response_model=dict)
def get_percent_no_collaboration_needed(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        service = StatsService(db)
        return service.get_percent_no_collaboration_needed()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Indicador de ONGs y tareas resueltas por la misma ONG responsable
@router.get("/ongs-and-tasks", response_model=list)
def get_ongs_and_tasks(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        service = StatsService(db)
        return service.get_ongs_and_tasks_resolved()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))