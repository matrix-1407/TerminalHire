from fastapi import APIRouter

from app.models.chat import ChatRequest
from app.services.fast_answers import get_fast_answer
from app.services.groq_service import generate_response

router = APIRouter()


@router.post("/chat")
async def chat(req: ChatRequest):
    # Fast-answer bypass
    fast = get_fast_answer(req.message)
    if fast:
        return {"response": fast, "source": "fast_answer"}

    response = generate_response(req.message, req.history)

    return {"response": response, "source": "llm"}