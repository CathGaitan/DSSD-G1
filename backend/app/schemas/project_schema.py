from app.schemas.task_schema import TaskCreate
from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    owner: str
    status: Optional[str] = "active"

    model_config = {
        "from_attributes": True
    }


class ProjectCreate(ProjectBase):
    tasks: List[TaskCreate]


class ProjectResponse(ProjectBase):
    id: int
