from fastapi import APIRouter
from app.bonita_integration import bonita_client

router = APIRouter()


@router.post("/test_login")
def test_login():
    session_info = bonita_client.login_bonita()
    return {"session": session_info["session"]}
