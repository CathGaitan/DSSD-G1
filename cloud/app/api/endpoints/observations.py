from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.observation_schema import ObservationBase 
from app.schemas.user_schema import UserResponse
from app.services.auth_service import get_current_user
from app.services.observation_service import ObservationService

router = APIRouter()


@router.post("/save_observation", response_model=dict, status_code=status.HTTP_201_CREATED)
async def save_observation(observation: ObservationBase, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    observation_service = ObservationService(db)
    return observation_service.save_observation_to_db(observation)


@router.get("/my_observations_ong", response_model=list[dict], status_code=status.HTTP_200_OK)
async def get_my_observations(db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    observation_service = ObservationService(db)
    return observation_service.get_my_observations(current_user)