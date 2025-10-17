# backend/app/api/router.py
from fastapi import APIRouter
from app.api.endpoints import ongs
from app.api.endpoints import projects
from app.api.endpoints import tasks

api_router = APIRouter()
api_router.include_router(ongs.router, prefix="/api/ongs", tags=["ongs"])
api_router.include_router(projects.router, prefix="/api/projects", tags=["projects"])
api_router.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])



@api_router.get("/")
def read_root():
    return {"message": "Holaaaaa 🚀"}
