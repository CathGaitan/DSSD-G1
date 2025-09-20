from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime


class BaseSchema(BaseModel):
    class Config:
        orm_mode = True
        allow_population_by_field_name = True


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

    @validator('name')
    def validate_name(cls, name):
        if not name or len(name.strip()) < 2:
            raise ValueError('El nombre del proyecto debe tener al menos 2 caracteres.')