import app.repositories.user_repository as user_repo
from sqlalchemy.orm import Session
from app.schemas.user_schema import UserCreate, UserResponse
from passlib.context import CryptContext
from typing import Optional
from fastapi import HTTPException, status
from app.schemas.ong_schema import OngResponse
from sqlalchemy.exc import IntegrityError
from app.repositories.ong_repository import OngRepository
from app.repositories.user_ong_repository import UserOngRepository
import logging
from app.bonita_integration.bonita_api import bonita

logger = logging.getLogger(__name__)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService:
    def __init__(self, db: Session):
        self.user_repo = user_repo.UserRepository(db)
        self.ong_repo = OngRepository(db)
        self.user_ong_repo = UserOngRepository(db)
        self.bonita = bonita

    def get_all_users(self, skip: int = 0, limit: int = 100) -> list[UserResponse]:
        users = self.user_repo.get_all(skip=skip, limit=limit)
        return [UserResponse.model_validate(user) for user in users]

    def get_user_by_id(self, user_id: int) -> Optional[UserResponse]:
        user = self.user_repo.get_by_id(user_id)
        if user:
            return UserResponse.model_validate(user)
        return None

    def get_user_by_username(self, username: str) -> Optional[UserResponse]:
        user = self.user_repo.get_by_username(username)
        if user:
            return UserResponse.model_validate(user)
        return None

    def get_user_by_email(self, email: str) -> Optional[UserResponse]:
        user = self.user_repo.get_by_email(email)
        if user:
            return UserResponse.model_validate(user)
        return None

    def create_user(self, user_data: UserCreate) -> UserResponse:
        print(f"Contraseña recibida: {user_data.password!r} (tipo: {type(user_data.password)})")
        hashed_password = pwd_context.hash(user_data.password)
        user_dict = user_data.model_dump()
        user_dict["hashed_password"] = hashed_password
        user_dict.pop("password", None) 
        try:
            new_user = self.user_repo.create(user_dict)
            logger.info(f"Usuario creado: {new_user.id}")
            return UserResponse.model_validate(new_user)
        except IntegrityError as e:
            if 'UNIQUE constraint failed: users.username' in str(e.orig):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de usuario ya está en uso.")
            elif 'UNIQUE constraint failed: users.email' in str(e.orig):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El correo electrónico ya está en uso.")
            else:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error al crear el usuario.")

    def authenticate_user(self, username: str, password: str) -> Optional[UserResponse]:
        user = self.user_repo.get_by_username(username)
        if user and pwd_context.verify(password, user.hashed_password):
            user = UserResponse.model_validate(user)
            token = self.bonita.login("walter.bates", "bpm") #MODIFICAR POR USER VERDADERO
            print("token bonita:", token)
            return user
        return None

    def add_user_to_ong(self, user_id: int, ong_id: int) -> None:
        user = self.user_repo.get_by_id(user_id)
        ong = self.ong_repo.get_by_id(ong_id)

        if not user or not ong:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario o ONG no encontrado.")

        association = self.user_ong_repo.get_association(user_id, ong_id)
        if association:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El usuario ya pertenece a esta ONG.")
        self.user_ong_repo.create_association(user_id, ong_id)

    def get_ongs_for_user(self, user_id: int) -> list[OngResponse]:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")
        ongs = user.ongs  # Accede a las ONGs asociadas al usuario
        return [OngResponse.model_validate(ong) for ong in ongs]

    def remove_user_from_ong(self, user_id: int, ong_id: int) -> None:
        user = self.user_repo.get_by_id(user_id)
        ong = self.ong_repo.get_by_id(ong_id)

        if not user or not ong:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario o ONG no encontrado.")

        association = self.user_ong_repo.get_association(user_id, ong_id)
        if not association:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El usuario no pertenece a esta ONG.")
        self.user_ong_repo.delete_association(user_id, ong_id)

    def delete_user(self, user_id: int) -> bool:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Usuario no encontrado.")
        self.user_repo.delete(user)
        return True
