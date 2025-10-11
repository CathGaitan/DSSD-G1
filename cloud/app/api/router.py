# backend/app/api/router.py
from fastapi import APIRouter
from app.api.endpoints import ongs

api_router = APIRouter()
api_router.include_router(ongs.router, prefix="/ongs", tags=["ongs"])

@api_router.get("/")
def read_root():
    return {"message": "Holaaaaa 🚀"}
