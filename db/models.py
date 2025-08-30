from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    uid: Optional[int] = Field(default=None, primary_key=True)
    uname: str
    upw: str
    umail: str

class FindRD(SQLModel, table=True):
    fid: Optional[int] = Field(default=None, primary_key=True)
    uid: int = Field(foreign_key="user.uid")
    keyword: str
    searched_at: datetime = Field(default_factory=datetime.utcnow)

class Element(SQLModel, table=True):
    ename: str = Field(primary_key=True)
    symbol: str
    esummary: str
    enum: int
    img: str

class AITalk(SQLModel, table=True):
    tid: Optional[int] = Field(default=None, primary_key=True)
    uid: int = Field(foreign_key="user.uid")
    topic: str
    user_input: str
    ai_response: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
