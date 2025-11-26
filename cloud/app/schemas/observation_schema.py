from pydantic import BaseModel, field_validator
from datetime import datetime


class ObservationBase(BaseModel):
    content: str
    user_id: int
    created_at: datetime
    accepted_at: datetime | None = None
    project_name: str

    model_config = {
        "from_attributes": True
    }

    @field_validator("content")
    def validate_content(cls, v):
        if not v.strip():
            raise ValueError("El contenido de la observación no puede estar vacío.")
        if len(v.strip()) < 10:
            raise ValueError("La observación debe tener al menos 10 caracteres.")
        return v


class ObservationCreate(ObservationBase):
    pass


class ObservationResponse(ObservationBase):
    id: int
    user_id: int
    created_at: datetime
