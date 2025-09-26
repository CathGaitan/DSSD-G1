from pydantic import BaseModel
from datetime import date


class TaskBase(BaseModel):
    title: str
    start_date: date
    end_date: date
    necessity: str

    model_config = {
        "from_attributes": True
    }


class TaskCreate(TaskBase):
    pass


class TaskResponse(TaskBase):
    id: int
