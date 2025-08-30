from pydantic import BaseModel, EmailStr

# 회원가입 요청용
class UserCreate(BaseModel):
    uname: str
    upw: str
    umail: EmailStr

# 로그인 요청용
class UserLogin(BaseModel):
    umail: EmailStr
    upw: str

# 응답용 (선택)
class UserOut(BaseModel):
    uid: int
    uname: str
    umail: EmailStr
