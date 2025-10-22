# backend/app/api/router.py
from fastapi import APIRouter
from app.api.endpoints import projects
from app.api.endpoints import ongs
from app.api.endpoints import users
from app.api.endpoints import auth
from app.bonita_integration import bonita_api

api_router = APIRouter()
api_router.include_router(bonita_api.router, prefix="/bonita", tags=["bonita"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(ongs.router, prefix="/ongs", tags=["ongs"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])


@api_router.get("/")
def read_root():
    return {"message": "Hola, soy el backend local del grupo 01 de DSSD!"}
