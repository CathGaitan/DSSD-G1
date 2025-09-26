# backend/app/api/router.py
from fastapi import APIRouter
from app.api.endpoints import projects
from app.bonita_integration import bonita_test

api_router = APIRouter()
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(bonita_test.router, prefix="/bonita", tags=["bonita"])


@api_router.get("/")
def read_root():
    return {"message": "Holaaaaa 🚀"}
