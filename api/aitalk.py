from fastapi import APIRouter
from service.aitalk_service import start_talk
from schemas.aitalk import AITalkInput

router = APIRouter(prefix="/aitalk")

@router.post("/")
def gpt_chat(payload: AITalkInput):
    return start_talk(payload)
