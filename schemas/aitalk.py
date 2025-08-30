from pydantic import BaseModel

class AITalkInput(BaseModel):
    uid: int
    topic: str
    user_input: str
