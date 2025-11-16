from app.schemas.task_schema import TaskBase, TaskCreate
from pydantic import BaseModel, field_validator, constr, model_validator
from typing import List, Optional, Annotated
from datetime import date


class ProjectBase(BaseModel):
    name: str
    description: str
    start_date: date
    end_date: date
    owner_id: int
    status: Optional[str] = "active"

    model_config = {
        "from_attributes": True
    }

    @field_validator("status")
    def validate_status(cls, v):
        allowed_status = {"active", "execution", "finished"}
        if v not in allowed_status:
            raise ValueError(f"El estado debe ser uno de: {', '.join(allowed_status)}")
        return v

    @field_validator("name")
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError("El nombre del proyecto no puede estar vacío.")
        if len(v) < 3:
            raise ValueError("El nombre del proyecto debe tener al menos 3 caracteres.")
        return v

    @field_validator("description")
    def validate_description(cls, v):
        if not v.strip():
            raise ValueError("La descripción del proyecto no puede estar vacía.")
        if len(v) < 15:
            raise ValueError("La descripción del proyecto debe tener al menos 15 caracteres.")
        return v

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("La fecha de finalización no puede ser anterior a la de inicio.")
        return self


class ProjectCreate(ProjectBase):
    tasks: List[TaskBase]

    @field_validator("tasks")
    def validate_tasks(cls, v):
        if len(v) == 0:
            raise ValueError("Debe incluir al menos una tarea al crear el proyecto.")
        return v


class ProjectResponse(ProjectBase):
    id: int
    tasks: List[TaskCreate]


class CompleteProject(ProjectBase):
    id: int
    tasks: List[TaskCreate]
    bonita_case_id: int
