from pydantic import BaseModel, field_validator


class OngBase(BaseModel):
    name: str


    model_config = {
        "from_attributes": True
    }

    @field_validator("name")
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError("El nombre de la ONG no puede estar vacío.")
        if len(v) < 2:
            raise ValueError("El nombre de la ONG debe tener al menos 2 caracteres.")
        return v
    

class OngCreate(OngBase):
    pass

class OngResponse(OngBase):
    id: int
