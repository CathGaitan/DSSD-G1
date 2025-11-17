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


@router.get("/{project_name}/all_tasks_have_ong")
def check_all_tasks_have_ong(project_name: str, db: Session = Depends(get_db)):
    service = ProjectService(db)
    result = service.all_tasks_have_ong(project_name)
    return {"project_name": project_name, "all_tasks_have_ong": result}


@router.get("/{project_name}/all_task_are_covers")
def check_all_tasks_are_covers(project_name: str, db: Session = Depends(get_db)):
    service = ProjectService(db)
    result = service.all_tasks_are_covers(project_name)
    return {"project_name": project_name, "all_tasks_are_covers": result}

@router.get("/projects_status/{status}", response_model=list[ProjectResponse])
def get_projects_with_status(status: str, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    service = ProjectService(db)
    return service.get_projects_with_status(status)