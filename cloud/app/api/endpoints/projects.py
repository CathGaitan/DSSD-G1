from http.client import HTTPException
from app.schemas.user_schema import UserResponse
from app.services.auth_service import get_current_user
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
def store_projects(project: ProjectCreate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    service = ProjectService(db)
    return service.store_projects(project)


@router.get("/search_with_name/{name}", response_model=ProjectResponse)
def get_project_by_name(name: str, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    service = ProjectService(db)
    project = service.get_project_by_name(name)
    if not project:
        raise HTTPException(status_code=404, detail="No se encontro el proyecto")
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    service = ProjectService(db)
    project = service.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="No se encontro el proyecto")
    return project
