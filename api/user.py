from fastapi import APIRouter
from schemas.user import UserCreate, UserLogin
from service.user_service import register_user, login_user

router = APIRouter(prefix="/user")

@router.post("/signup")
def signup(user: UserCreate):
    return register_user(user)

@router.post("/login")
def login(user: UserLogin):
    return login_user(user)
