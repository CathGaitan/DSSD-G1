from typing import Optional
from pydantic import BaseModel, field_validator, model_validator
from datetime import date


class TaskBase(BaseModel):
    title: str
    necessity: str
    quantity: str
    start_date: date
    end_date: date
    resolves_by_itself: bool
    status: str = "pending"

    model_config = {
        "from_attributes": True
    }

    @field_validator("title")
    def validate_title(cls, v):
        if not v.strip():
            raise ValueError("El título de la tarea no puede estar vacío.")
        if len(v) < 5:
            raise ValueError("El título de la tarea debe tener al menos 5 caracteres.")
        return v

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("La fecha de finalización no puede ser anterior a la de inicio.")
        return self


class TaskCreate(TaskBase):
    pass


class TaskResponse(TaskBase):
    id: int


class CommitRequest(BaseModel):
    task_id: int
    ong_id: int
