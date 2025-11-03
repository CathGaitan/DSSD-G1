from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
from app.services.user_service import UserService
from app.services.auth_service import create_access_token
from app.core.database import get_db
from datetime import timedelta
import requests

router = APIRouter()

CLOUD_LOGIN_URL = "http://cloud:10000/auth/login"  # Reemplazar con la URL real de Cloud para levantar el entorno cloud

@router.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    cloud: bool = Form(False),
    db: Session = Depends(get_db)
):
    user_service = UserService(db)
    user = user_service.authenticate_user(username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    access_token = create_access_token(data={"sub": user.username}, expires_delta=timedelta(minutes=30))

    result = {"access_token": access_token, "token_type": "bearer"}

    if cloud:
        # llamada a Cloud
        cloud_response = requests.post(
            CLOUD_LOGIN_URL,
            data={"username": username, "password": password, "grant_type": "password"},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        if cloud_response.ok:
            result["cloud_access_token"] = cloud_response.json().get("access_token")
        else:
            result["cloud_error"] = "Error al autenticar en Cloud"

    return result