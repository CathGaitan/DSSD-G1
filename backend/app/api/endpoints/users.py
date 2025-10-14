from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.user_schema import UserCreate, UserResponse
from sqlalchemy.orm import Session
from app.services.auth_service import get_current_user
from app.core.database import get_db
from app.services.user_service import UserService

router = APIRouter()
user_service = UserService(db=Depends(get_db))

# Get all users
@router.get("/", response_model=list[UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.get_all_users(skip=skip, limit=limit)


# Get current user
@router.get("/me", response_model=UserResponse)
def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

# Create a new user
@router.post("/", response_model=UserResponse, status_code=201)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    return UserService(db).create_user(user_in)

# Delete a user
@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    UserService(db).delete_user(user_id)  
    return