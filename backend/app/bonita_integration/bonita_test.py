from fastapi import APIRouter
from app.bonita_integration.bonita_client import BonitaClient


router = APIRouter()
bonita = BonitaClient()

@router.post("/test_login")
def test_login():
    session_info = bonita.login()
    return {session_info}

@router.get("/test_processes")
def test_get_processes():
    processes = bonita.get_all_processes()
    return {"processes": processes}
