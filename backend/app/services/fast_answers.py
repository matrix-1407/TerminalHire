import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]
ANSWERS_PATH = BASE_DIR / "data" / "interview_answers.json"


def get_fast_answer(question: str):
    q = question.lower().strip()

    with ANSWERS_PATH.open("r", encoding="utf-8") as f:
        answers = json.load(f)["answers"]

    mapping = {
        "tell me about yourself": "tell_me_about_yourself",
        "introduce yourself": "tell_me_about_yourself",
        "why should we hire you": "why_should_we_hire_you",
        "what are your strengths": "biggest_strength",
        "what are your weaknesses": "biggest_weakness",
        "what is your career goal": "career_goal",
    }

    for key, value in mapping.items():
        if key in q:
            return answers[value]["answer"]

    return None