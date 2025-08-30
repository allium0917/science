from openai import OpenAI
from db.database import get_session
from db.models import AITalk
from schemas.aitalk import AITalkInput
from datetime import datetime

def start_talk(payload: AITalkInput):
    # ① GPT 호출
    # 실제 구현 시 openai.ChatCompletion.create 등 사용
    response_text = f"GPT 응답 예시: {payload.user_input}"  # 실제 GPT 호출로 대체

    # ② 저장
    with get_session() as session:
        record = AITalk(
            uid=payload.uid,
            topic=payload.topic,
            user_input=payload.user_input,
            ai_response=response_text,
            created_at=datetime.utcnow()
        )
        session.add(record)
        session.commit()
        session.refresh(record)
        return {"ai_response": response_text, "tid": record.tid}
