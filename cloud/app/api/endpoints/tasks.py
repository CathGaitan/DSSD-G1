from app.repositories.task_repository import TaskRepository
from app.schemas.task_schema import CommitRequest
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db

router = APIRouter()


@router.post("/task_compromise")
async def commit_task_to_ong(commit_data: CommitRequest, db: Session = Depends(get_db)):
    task_repo = TaskRepository(db)
    try:
        result = task_repo.commit_task_to_ong(commit_data.task_id, commit_data.ong_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
