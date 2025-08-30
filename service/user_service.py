from db.models import User
from db.database import get_session
from utils.security import get_password_hash, verify_password, create_access_token
from schemas.user import UserCreate, UserLogin
from fastapi import HTTPException
from sqlmodel import select

# 회원가입 처리
def register_user(user: UserCreate):
    with get_session() as session:
        # 이메일 중복 검사
        existing_user = session.exec(select(User).where(User.umail == user.umail)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="이미 존재하는 이메일입니다.")

        hashed_pw = get_password_hash(user.upw)
        new_user = User(uname=user.uname, upw=hashed_pw, umail=user.umail)
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return {"msg": "회원가입 완료", "uid": new_user.uid}

# 로그인 처리
def login_user(user: UserLogin):
    with get_session() as session:
        db_user = session.exec(select(User).where(User.umail == user.umail)).first()
        if not db_user or not verify_password(user.upw, db_user.upw):
            raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 올바르지 않습니다.")
        
        token = create_access_token
