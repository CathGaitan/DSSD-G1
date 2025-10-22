from pydantic import BaseModel, field_validator


class BonitaUserModel(BaseModel):
    username: str
    password: str

    model_config = {
        "from_attributes": True
    }

    @field_validator("username")
    def validate_username(cls, v):
        if not v.strip():
            raise ValueError("El username no puede estar vacío.")
        return v

    @field_validator("password")
    def validate_password(cls, v):
        if not v.strip():
            raise ValueError("La contraseña no puede estar vacía.")
        return v
