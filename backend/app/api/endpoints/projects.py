from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional

from api.deps import get_project_service
from services.project_service import ProjectService
from schemas.project import ProjectCreate, ProjectResponse


@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(
    project_data: ProjectCreate,
    project_service: ProjectService = Depends(get_project_service)
):
    return project_service.create_project(project_data)