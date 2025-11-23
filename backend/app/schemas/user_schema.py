from pydantic import BaseModel, EmailStr, constr, field_validator
from typing import List, Optional, Annotated
from app.schemas.ong_schema import OngResponse
import re


class UserBase(BaseModel):
    username: Annotated[str, constr(strip_whitespace=True, min_length=3, max_length=50)]
    email: EmailStr #valida formato de email automáticamente.

    model_config = {
        "from_attributes": True
    }

    @field_validator("username")
    def validate_username(cls, v):
        if not v.strip():
            raise ValueError("El nombre de usuario no puede estar vacío.")
        if " " in v:
            raise ValueError("El nombre de usuario no puede contener espacios.")
        return v

class UserCreate(UserBase):
    password: Annotated[str, constr(min_length=6, max_length=128)]

    @field_validator("password")
    def validate_password_strength(cls, v):
        if v.isdigit() or v.isalpha():
            raise ValueError("La contraseña debe incluir letras y números.")
        if len(v) < 6:
            raise ValueError("La contraseña debe tener al menos 6 caracteres.")
         # Al menos una mayúscula
        if not re.search(r"[A-Z]", v):
            raise ValueError("La contraseña debe incluir al menos una letra mayúscula.")
        # Al menos una minúscula
        if not re.search(r"[a-z]", v):
            raise ValueError("La contraseña debe incluir al menos una letra minúscula.")
        # Al menos un número
        if not re.search(r"\d", v):
            raise ValueError("La contraseña debe incluir al menos un número.")
        # Al menos un carácter especial (no letra ni número)
        if not re.search(r"[^A-Za-z0-9]", v):
            raise ValueError("La contraseña debe incluir al menos un carácter especial.")
        return v


class UserResponse(UserBase):
    id: int
    ongs: Optional[List[OngResponse]] = []  # para mostrar a qué ONGs pertenece el usuario
    is_manager: bool
