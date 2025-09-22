# backend/app/api/router.py
from fastapi import APIRouter
from app.api.endpoints import projects

api_router = APIRouter()
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])


@api_router.get("/")
def read_root():
    return {"message": "Holaaaaa 🚀"}
