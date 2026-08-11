import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]
DATA_DIR = BASE_DIR / "data"
PROMPT_PATH = Path(__file__).parent / "system_prompt.md"


def load_json(filename: str):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


def build_system_prompt() -> str:
    system_prompt = PROMPT_PATH.read_text(encoding="utf-8")

    profile = load_json("profile.json")
    projects = load_json("projects.json")
    personality = load_json("personality.json")
    swoc = load_json("swoc.json")
    constraints = load_json("constraints.json")
    interview_answers = load_json("interview_answers.json")

    context = {
        "profile": profile,
        "projects": projects,
        "personality": personality,
        "swoc": swoc,
        "constraints": constraints,
        "interview_answers": interview_answers,
    }

    return (
        system_prompt
        + "\n\n--- STRUCTURED CANDIDATE DATA ---\n"
        + json.dumps(context, indent=2, ensure_ascii=False)
    )