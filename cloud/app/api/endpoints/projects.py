from backend.app.schemas.user_schema import UserResponse
from backend.app.services.auth_service import get_current_user
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.project_service import ProjectService
from app.schemas.project_schema import ProjectResponse
from app.schemas.project_schema import ProjectCreate

router = APIRouter()


@router.get("/", response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    service = ProjectService(db)
    return service.get_projects()


@router.post("/store_projects", response_model=ProjectResponse)
def store_projects(project: ProjectCreate, db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.store_projects(project)
