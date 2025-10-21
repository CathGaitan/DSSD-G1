from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.project_schema import ProjectCreate, ProjectResponse
from app.services.project_service import ProjectService

router = APIRouter()


@router.post("/", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.create_project(project)


@router.get("/my-projects/", response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    service = ProjectService(db)
    return service.get_projects()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    service = ProjectService(db)
    project = service.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="No se encontro el proyecto")
    return project
