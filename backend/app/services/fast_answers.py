import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]
ANSWERS_PATH = BASE_DIR / "data" / "interview_answers.json"

EXACT_HELP_KEYS = {"help", "$help", "/help", "help?", "$help?", "commands", "command", "?"}

TOPIC_MAPPING = {
    # Preset Command Keys
    "overview": "overview",
    "strengths": "strengths",
    "projects": "projects",
    "impact": "impact",
    "interview": "interview",
    "fit": "fit",
    "contact": "contact",
    "resume": "resume",
    "github": "github",
    "linkedin": "linkedin",

    # Natural Question Mappings
    "tell me about yourself": "tell_me_about_yourself",
    "introduce yourself": "tell_me_about_yourself",
    "tell me about this candidate": "tell_me_about_candidate",
    "tell me about the candidate": "tell_me_about_candidate",
    "tell me about candidate": "tell_me_about_candidate",
    "candidate overview": "overview",
    "who is mrudul": "overview",
    "who is the candidate": "overview",

    "why should we hire you": "why_should_we_hire_candidate",
    "why should we hire this candidate": "why_should_we_hire_candidate",
    "why should we hire the candidate": "why_should_we_hire_candidate",
    "why hire candidate": "why_should_we_hire_candidate",
    "why hire him": "why_should_we_hire_candidate",

    "what are your strengths": "strengths",
    "what are his strengths": "strengths",
    "what are the candidate strengths": "strengths",

    "what are your weaknesses": "biggest_weakness",
    "what are his weaknesses": "biggest_weakness",

    "what is your career goal": "career_goal",
    "what is his career goal": "career_goal",

    "do you have industry experience": "industry_experience",
    "does he have industry experience": "industry_experience",

    "what roles are you applying for": "roles_applying_for",
    "what roles is he applying for": "roles_applying_for",

    "are you open to relocation": "preferred_work_mode",
    "is he open to relocation": "preferred_work_mode",

    "what are your best projects": "best_projects",
    "what are his best projects": "best_projects",
    "what are the candidate's best projects": "best_projects",
    "all his projects": "best_projects",
    "his projects": "best_projects",
    "flagship projects": "best_projects",

    "which project was the hardest": "hardest_project",
    "what was the hardest project": "hardest_project",
    "hardest project": "hardest_project",

    "what makes him different": "what_makes_him_different",
    "what makes this candidate different": "what_makes_him_different",

    "is he available for internship": "availability",
    "availability": "availability",
}


def get_fast_answer(question: str):
    q = question.lower().strip()
    clean_q = q.replace("$", "").replace("/", "").strip()

    with ANSWERS_PATH.open("r", encoding="utf-8") as f:
        answers = json.load(f)["answers"]

    # 1. Exact help command match check
    if q in EXACT_HELP_KEYS or clean_q in EXACT_HELP_KEYS:
        return answers.get("help", {}).get("answer")

    # 2. Exact topic match
    if clean_q in TOPIC_MAPPING:
        key = TOPIC_MAPPING[clean_q]
        return answers.get(key, {}).get("answer")

    # 3. Topic Substring search (sorted by key length descending for longest phrase priority)
    sorted_topics = sorted(TOPIC_MAPPING.items(), key=lambda x: len(x[0]), reverse=True)
    for topic_phrase, val in sorted_topics:
        if topic_phrase in q:
            return answers.get(val, {}).get("answer")

    return None