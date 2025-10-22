# app/routers/task_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.task_schema import CommitRequest
from app.schemas.user_schema import UserResponse
from app.services.task_service import TaskService
from app.services.auth_service import get_current_user

router = APIRouter()

@router.post("/task_compromise")
async def commit_task_to_ong(commit_data: CommitRequest, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    service = TaskService(db)
    try:
        return service.commit_task_to_ong(commit_data.task_id, commit_data.ong_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/select_ong_for_task")
async def select_ong_for_task(commit_data: CommitRequest, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    service = TaskService(db)
    try:
        return service.select_ong_for_task(commit_data.task_id, commit_data.ong_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
