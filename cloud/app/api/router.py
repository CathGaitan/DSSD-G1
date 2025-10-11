# backend/app/api/router.py
from fastapi import APIRouter

api_router = APIRouter()

@api_router.get("/")
def read_root():
    return {"message": "Holaaaaa 🚀"}
