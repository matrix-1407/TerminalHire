from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.chat import ChatRequest
from app.services.fast_answers import get_fast_answer
from app.services.groq_service import generate_response
from app.services.stream_service import stream_response

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat")
async def chat(req: ChatRequest):
    fast = get_fast_answer(req.message)
    if fast:
        return {
            "source": "fast-answer",
            "response": fast
        }

    response = generate_response(req.message, req.history)
    return {
        "source": "llm",
        "response": response
    }


@router.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    async def event_generator():
        async for chunk in stream_response(req.message, req.history):
            yield chunk

    return StreamingResponse(
        event_generator(),
        media_type="text/plain",
        headers={
            "X-Accel-Buffering": "no",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )