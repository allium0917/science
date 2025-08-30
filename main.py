from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.database import init_db
from api import user, element, findrd, aitalk  # ← 필요한 라우터 추가

app = FastAPI()

origins = [
    "",  # React dev 서버
    "",  # Vite dev 서버
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)


init_db()

# 라우터 등록
app.include_router(user.router, prefix="/api/user", tags=["user"])
app.include_router(element.router, prefix="/api/element", tags=["element"])
app.include_router(findrd.router, prefix="/api/findrd", tags=["findrd"])
app.include_router(aitalk.router, prefix="/api/aitalk", tags=["aitalk"])
