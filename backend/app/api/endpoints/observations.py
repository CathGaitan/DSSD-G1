from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.observation_schema import ObservationCreate, ObservationResponse 
from app.schemas.user_schema import UserResponse
from app.services.auth_service import get_current_user, get_current_manager_user
from app.services.observation_service import ObservationService
from fastapi import Body

router = APIRouter()


@router.post("/send_observation", response_model=dict, status_code=status.HTTP_201_CREATED)
async def send_observation(observation: ObservationCreate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_manager_user)):
    observation_service = ObservationService(db)
    return observation_service.send_observation_to_bonita(observation, current_user)


@router.post("/accept_observation")
async def accept_observation(observation_id: int = Body(..., embed=True),db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    observation_service = ObservationService(db)
    return observation_service.accept_observation(observation_id, current_user)
