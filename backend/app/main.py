from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.profile_service import load_candidate_profile

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