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
    
    # Lightweight project summaries to reduce token usage
    project_summaries = []

    for p in projects["projects"]:
        project_summaries.append({
            "name": p["name"],
            "category": p.get("category"),
            "technologies": p.get("technologies", [])[:8],
            "description": p.get("description", "")[:300]
        })

    context = {
        "profile": profile,
        "projects": project_summaries,
        "personality": personality,
        "swoc": swoc,
        "constraints": constraints,
    }

    return (
        system_prompt
        + "\n\n--- STRUCTURED CANDIDATE DATA ---\n"
        + json.dumps(context, indent=2, ensure_ascii=False)
    )