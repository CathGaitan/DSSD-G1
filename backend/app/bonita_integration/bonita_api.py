from fastapi import APIRouter, HTTPException
from app.bonita_integration.bonita_client import BonitaClient
from app.schemas.bonita_schema import BonitaUserModel
from fastapi import Request

router = APIRouter()
bonita = BonitaClient()


@router.post("/login")
def login(user_bonita: BonitaUserModel, request: Request):
    try:
        session_info = bonita.login(request, user_bonita.username, user_bonita.password)
        return {"message": "Logeo exitoso", "session": session_info}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"No se pudo logear: {str(e)}")
