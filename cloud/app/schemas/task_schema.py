from typing import Optional
from pydantic import BaseModel, field_validator, model_validator
from datetime import date


class TaskBase(BaseModel):
    title: str
    necessity: str
    quantity: str
    start_date: date
    end_date: date
    resolves_by_itself: bool = False
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

    @field_validator("necessity")
    def validate_necessity(cls, v):
        if not v.strip():
            raise ValueError("La necesidad de la tarea no puede estar vacía.")
        if len(v) < 5:
            raise ValueError("La necesidad de la tarea debe tener al menos 5 caracteres.")
        return v

    @field_validator("quantity")
    def validate_quantity(cls, v):
        if not v.strip():
            raise ValueError("La cantidad a especificar no puede estar vacía.")
        return v

    @field_validator("start_date")
    def validate_start_date(cls, v):
        if v is None:
            raise ValueError("La fecha de inicio de la tarea no puede estar vacía.")
        return v

    @field_validator("end_date")
    def validate_end_date(cls, v):
        if v is None:
            raise ValueError("La fecha de finalización de la tarea no puede estar vacía.")
        return v

    @field_validator("resolves_by_itself")
    def validate_resolves_by_itself(cls, v):
        if v:
            raise ValueError(f"Las tareas en cloud siempre las resuelve otra ONG")
        return v

    @field_validator("status")
    def validate_status(cls, v):
        if v is not False:
            raise ValueError(f"La tarea debe iniciar en estado: pending")
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
