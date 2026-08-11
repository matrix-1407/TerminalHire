import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]
ANSWERS_PATH = BASE_DIR / "data" / "interview_answers.json"


def get_fast_answer(question: str):
    q = question.lower().strip()

    with ANSWERS_PATH.open("r", encoding="utf-8") as f:
        answers = json.load(f)["answers"]

    mapping = {
        # Introduction
        "tell me about yourself": "tell_me_about_yourself",
        "introduce yourself": "tell_me_about_yourself",
        "tell me about this candidate": "tell_me_about_candidate",
        "tell me about the candidate": "tell_me_about_candidate",

        # Hiring
        "why should we hire you": "why_should_we_hire_candidate",
        "why should we hire this candidate": "why_should_we_hire_candidate",
        "why should we hire the candidate": "why_should_we_hire_candidate",

        # Strengths / weaknesses
        "what are your strengths": "biggest_strength",
        "what are his strengths": "biggest_strength",
        "what are the candidate strengths": "biggest_strength",

        "what are your weaknesses": "biggest_weakness",
        "what are his weaknesses": "biggest_weakness",
        "what are the candidate weaknesses": "biggest_weakness",

        # Career
        "what is your career goal": "career_goal",
        "what is his career goal": "career_goal",
        "what is the candidate's career goal": "career_goal",

        # Experience
        "do you have industry experience": "industry_experience",
        "does he have industry experience": "industry_experience",
        "does the candidate have industry experience": "industry_experience",

        # Roles
        "what roles are you applying for": "roles_applying_for",
        "what roles is he applying for": "roles_applying_for",
        "what roles is the candidate applying for": "roles_applying_for",

        # Work mode
        "are you open to relocation": "preferred_work_mode",
        "is he open to relocation": "preferred_work_mode",
        "is the candidate open to relocation": "preferred_work_mode",

        # Projects
        "what are your best projects": "best_projects",
        "what are his best projects": "best_projects",
        "what are the candidate's best projects": "best_projects",

        "which project was the hardest": "hardest_project",
        "what was the hardest project": "hardest_project",
        "what was the most difficult project": "hardest_project",
        "what was the candidate's most difficult project": "hardest_project",

        # Differentiation
        "what makes him different": "what_makes_him_different",
        "what makes this candidate different": "what_makes_him_different",

        # Availability
        "is he available for internship": "availability",
        "is the candidate available for internship": "availability",
    }

    for key, value in mapping.items():
        if key in q:
            return answers.get(value, {}).get("answer")

    return None