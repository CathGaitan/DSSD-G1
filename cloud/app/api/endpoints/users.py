from app.schemas.ong_schema import OngResponse
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
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    user_service = UserService(db)
    return user_service.get_all_users(skip=skip, limit=limit)


# Get current user
@router.get("/me", response_model=UserResponse)
def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

# Create a new user
@router.post("/create", response_model=UserResponse, status_code=201)
#def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
def create_user(user_in: UserCreate, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    return UserService(db).create_user(user_in)

# Delete a user
@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    UserService(db).delete_user(user_id)  
    return

# Get ONGs associated with a user
@router.get("/{user_id}/ongs", response_model=List[OngResponse])
def get_user_ongs(user_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    user_service = UserService(db)
    ongs = user_service.get_ongs_for_user(user_id)
    if ongs is None:
        raise HTTPException(status_code=404, detail="User not found")
    return ongs

# Associate a user with an ONG
@router.post("/{user_id}/ongs/{ong_id}", status_code=201)
def associate_user_with_ong(user_id: int, ong_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    user_service = UserService(db)
    try:
        user_service.add_user_to_ong(user_id, ong_id)
    except HTTPException as e:
        raise e
    return {"message": "User associated with ONG successfully"}

# Disassociate a user from an ONG
@router.delete("/{user_id}/ongs/{ong_id}", status_code=204)
def disassociate_user_from_ong(user_id: int, ong_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    user_service = UserService(db)
    try:
        user_service.remove_user_from_ong(user_id, ong_id)
    except HTTPException as e:
        raise e
    return {"message": "User disassociated from ONG successfully"}


@router.get("/{user_id}/email", response_model=dict)
def get_email_by_user_id(user_id: int, db: Session = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    user_service = UserService(db)
    user = user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"email": user.email}
