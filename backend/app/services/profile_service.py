import json
from pathlib import Path

from app.models import CandidateProfile


BASE_DIR = Path(__file__).resolve().parents[3]
PROFILE_PATH = BASE_DIR / "data" / "profile.json"


def load_candidate_profile() -> CandidateProfile:
    with PROFILE_PATH.open("r", encoding="utf-8") as file:
        data = json.load(file)

    return CandidateProfile.model_validate(data)