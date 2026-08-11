from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.profile_service import load_candidate_profile

from app.prompts.prompt_builder import build_system_prompt

from app.services.fast_answers import get_fast_answer
from app.routes.chat import router as chat_router

app = FastAPI(title="TerminalHire API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "TerminalHire API is running"}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/profile")
async def get_profile():
    profile = load_candidate_profile()
    return profile.model_dump()

@app.get("/prompt-preview")
async def prompt_preview():
    prompt = build_system_prompt()
    return {"length": len(prompt), "preview": prompt[:3000]}

@app.get("/fast-answer")
async def fast_answer(q: str):
    answer = get_fast_answer(q)
    return {"answer": answer}

app.include_router(chat_router, prefix="/api", tags=["chat"])