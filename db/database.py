from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL = "sqlite:///./db.sqlite3"
engine = create_engine(DATABASE_URL, echo=True)

# DB 초기화
def init_db():
    SQLModel.metadata.create_all(bind=engine)

# 의존성으로 주입될 DB 세션
def get_db():
    with Session(engine) as session:
        yield session
