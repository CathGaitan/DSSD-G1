from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.project_schema import ProjectCreate, ProjectResponse
from app.services.project_service import ProjectService
from app.schemas.user_schema import UserResponse
from app.services.auth_service import get_current_user

router = APIRouter()


@router.post("/create", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    service = ProjectService(db)
    return service.create_project(project)


@router.get("/my-projects/", response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    service = ProjectService(db)
    return service.get_projects(user=current_user)


@router.get("/projects_status/{status}", response_model=list[ProjectResponse])
def get_projects_with_status(status: str, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    service = ProjectService(db)
    return service.get_projects_with_status(status)


@router.get("/check_name/{name}")
def check_project_name(name: str, db: Session = Depends(get_db)):
    service = ProjectService(db)
    project = service.get_project_by_name(name)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project name is available")
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Project name already exists")

@router.get("/search_name/{name}", response_model=ProjectResponse)
def get_project_by_name(name: str, db: Session = Depends(get_db)):
    service = ProjectService(db)
    project = service.get_project_by_name(name) # Utiliza el método existente del servicio
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Project '{name}' not found in local DB.")
    return project
