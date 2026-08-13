import json
import re
from pathlib import Path

from groq import RateLimitError

from app.models.jd import JDAnalysisResponse, RelevantProject
from app.services.groq_service import client, model


BASE_DIR = Path(__file__).resolve().parents[3]
DATA_DIR = BASE_DIR / "data"

SKILL_VOCABULARY = [
    # Languages
    'python', 'javascript', 'typescript', 'java', 'c++', 'c',

    # Frontend
    'react', 'next.js', 'html', 'css', 'tailwind css', 'bootstrap',

    # Backend
    'fastapi', 'node.js', 'express', 'rest api', 'graphql',

    # Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'supabase',

    # Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'linux',
    'git', 'github actions', 'cicd', 'terraform',

    # Networking & Security
    'networking', 'tcp/ip', 'dns', 'http', 'security',
    'cybersecurity', 'cloud security',

    # AI / Data
    'ai', 'machine learning', 'llm', 'rag', 'vector database',

    # General
    'cloud', 'devops'
]

SKILL_ALIASES = {
    # Languages
    'javascript': ['javascript', 'js'],
    'typescript': ['typescript', 'ts'],
    'c++': ['c++', 'cpp'],

    # Frontend
    'react': ['react', 'reactjs', 'react.js'],
    'next.js': ['next.js', 'nextjs', 'next js'],
    'tailwind css': ['tailwind', 'tailwind css'],
    'bootstrap': ['bootstrap'],

    # Backend
    'node.js': ['node.js', 'nodejs', 'node js'],
    'express': ['express', 'express.js', 'expressjs'],
    'rest api': ['rest api', 'rest apis', 'restful api', 'restful apis', 'api', 'apis'],
    'graphql': ['graphql'],

    # Databases
    'sql': ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite'],
    'mysql': ['mysql'],
    'postgresql': ['postgresql', 'postgres'],
    'mongodb': ['mongodb', 'mongo'],
    'redis': ['redis'],
    'supabase': ['supabase'],

    # Cloud & DevOps
    'aws': ['aws', 'amazon web services'],
    'azure': ['azure', 'microsoft azure'],
    'gcp': ['gcp', 'google cloud', 'google cloud platform'],
    'docker': ['docker', 'containerization'],
    'kubernetes': ['kubernetes', 'k8s'],
    'linux': ['linux', 'ubuntu'],
    'git': ['git', 'github'],
    'github actions': ['github actions', 'github workflows'],
    'cicd': ['cicd', 'ci/cd', 'continuous integration', 'continuous deployment'],
    'terraform': ['terraform'],

    # Networking & Security
    'networking': ['networking', 'computer networks', 'network'],
    'tcp/ip': ['tcp/ip', 'tcp ip', 'tcp', 'ip'],
    'dns': ['dns'],
    'http': ['http', 'https'],
    'security': ['security', 'application security'],
    'cybersecurity': ['cybersecurity', 'cyber security', 'infosec'],
    'cloud security': ['cloud security'],

    # AI / Data
    'ai': ['ai', 'artificial intelligence'],
    'machine learning': ['machine learning', 'ml'],
    'llm': ['llm', 'large language model', 'large language models'],
    'rag': ['rag', 'retrieval augmented generation'],
    'vector database': ['vector database', 'vector db', 'faiss', 'chroma'],

    # General
    'cloud': ['cloud', 'cloud computing'],
    'devops': ['devops', 'dev ops']
}

DISPLAY_SKILLS = {
    'python': 'Python',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'java': 'Java',
    'c++': 'C++',
    'c': 'C',

    'react': 'React',
    'next.js': 'Next.js',
    'html': 'HTML',
    'css': 'CSS',
    'tailwind css': 'Tailwind CSS',
    'bootstrap': 'Bootstrap',

    'fastapi': 'FastAPI',
    'node.js': 'Node.js',
    'express': 'Express',
    'rest api': 'REST APIs',
    'graphql': 'GraphQL',

    'sql': 'SQL',
    'mysql': 'MySQL',
    'postgresql': 'PostgreSQL',
    'mongodb': 'MongoDB',
    'redis': 'Redis',
    'supabase': 'Supabase',

    'aws': 'AWS',
    'azure': 'Azure',
    'gcp': 'Google Cloud',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'linux': 'Linux',
    'git': 'Git',
    'github actions': 'GitHub Actions',
    'cicd': 'CI/CD',
    'terraform': 'Terraform',

    'networking': 'Networking',
    'tcp/ip': 'TCP/IP',
    'dns': 'DNS',
    'http': 'HTTP/HTTPS',
    'security': 'Security',
    'cybersecurity': 'Cybersecurity',
    'cloud security': 'Cloud Security',

    'ai': 'AI',
    'machine learning': 'Machine Learning',
    'llm': 'LLMs',
    'rag': 'RAG',
    'vector database': 'Vector Databases',

    'cloud': 'Cloud',
    'devops': 'DevOps'
}

PROFILE_SKILL_MAP = {
    'node_js': 'node.js',
    'express_js': 'express',
    'sql_mysql': 'sql',
    'postgres': 'postgresql',
    'tailwind': 'tailwind css',
    'llm_rag': 'llm',
    'cloud_aws': 'aws',
    'cloud_azure': 'azure',
    'cloud_gcp': 'gcp',
    'ci_cd': 'cicd',
    'github': 'git'
}


def _load_json(name: str):
    with (DATA_DIR / name).open("r", encoding="utf-8") as file:
        return json.load(file)


def _contains_skill(text: str, skill: str) -> bool:
    aliases = SKILL_ALIASES.get(skill, [skill])
    return any(re.search(rf"(?<![a-z0-9]){re.escape(alias)}(?![a-z0-9])", text) for alias in aliases)


def extract_required_skills(text: str) -> list[str]:
    normalized = text.lower()
    return [skill for skill in SKILL_VOCABULARY if _contains_skill(normalized, skill)]


def _candidate_skills(profile: dict, projects: list[dict]) -> set[str]:
    skills = set()

    for raw_skill in profile.get("skills", {}):
        skills.add(PROFILE_SKILL_MAP.get(raw_skill, raw_skill).replace("_", " "))

    project_text = json.dumps(projects, ensure_ascii=False).lower()
    for skill in SKILL_VOCABULARY:
        if _contains_skill(project_text, skill):
            skills.add(skill)

    career_text = json.dumps(profile.get("career", {}), ensure_ascii=False).lower()
    if "cloud" in career_text:
        skills.add("cloud")
    if "devops" in career_text:
        skills.add("devops")
    if "ai" in career_text:
        skills.add("ai")

    return skills


def _job_title(text: str) -> str:
    patterns = [
        r"(?:job title|role|position)\s*[:\-]\s*([A-Za-z0-9 /&+\-.]{3,80})",
        r"\b([A-Za-z]+(?:\s+[A-Za-z]+){0,4}\s+(?:Intern|Engineer|Developer|Analyst))\b",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return match.group(1).strip(" .:-")
    return "Uploaded Job Description"


def _project_relevance(required_skills: list[str], projects: list[dict]) -> tuple[float, list[RelevantProject]]:
    if not required_skills:
        return 0.0, []

    scored = []
    required = set(required_skills)

    for project in projects:
        project_text = json.dumps(project, ensure_ascii=False).lower()
        hits = [skill for skill in required if _contains_skill(project_text, skill)]
        ratio = len(hits) / len(required)

        if ratio >= 0.5:
            label = "high"
        elif ratio >= 0.25:
            label = "medium"
        else:
            label = "low"

        reasons = [DISPLAY_SKILLS[skill] for skill in hits[:4]]
        reason = ", ".join(reasons) if reasons else project.get("category", "Project experience")
        scored.append((ratio, RelevantProject(name=project.get("name", "Project"), relevance=label, reason=reason)))

    scored.sort(key=lambda item: item[0], reverse=True)
    top = [item[1] for item in scored[:3]]
    average_top = sum(item[0] for item in scored[:3]) / min(3, len(scored))
    return average_top, top


def _experience_relevance(required_skills: list[str], profile: dict, projects: list[dict]) -> float:
    combined = json.dumps({
        "career": profile.get("career", {}),
        "experience": profile.get("experience", []),
        "technical_involvement": profile.get("technical_involvement", []),
        "projects": projects,
    }, ensure_ascii=False).lower()
    if not required_skills:
        return 0.0
    return sum(1 for skill in required_skills if _contains_skill(combined, skill)) / len(required_skills)


def _fit(score: int) -> str:
    if score >= 80:
        return "strong"
    if score >= 60:
        return "moderate"
    return "weak"

def _target_level(jd_text: str) -> str:
    text = jd_text.lower()

    if any(word in text for word in ['intern', 'internship', 'trainee', 'graduate', 'fresher', 'entry level']):
        return 'internship / entry-level'

    if any(word in text for word in ['senior', 'lead', 'staff', 'principal', 'architect']):
        return 'senior'

    return 'mid-level'
    
def _fallback_summary(
    score: int,
    fit: str,
    matched: list[str],
    missing: list[str],
    level: str,
) -> tuple[str, str]:

    matched_text = ', '.join(matched[:5]) or 'the broader engineering requirements'
    missing_text = ', '.join(missing[:4])

    summary = (
        f'Mrudul appears to be a {fit} match with a deterministic score of {score}, '
        f'supported by alignment in {matched_text}.'
    )

    recommendation = (
        f'Recommend moving forward for a {level} recruiter screen focused on project depth, '
        f'practical implementation, and role-specific expectations.'
    )

    if missing_text:
        recommendation += f' Probe gaps around {missing_text}.'

    return summary, recommendation

def _generate_summary(
    score: int,
    fit: str,
    matched: list[str],
    missing: list[str],
    projects: list[RelevantProject],
    level: str,
) -> tuple[str, str]:

    fallback = _fallback_summary(score, fit, matched, missing, level)

    prompt = (
        'Write a concise recruiter-facing third-person JD fit analysis for Mrudul Bokade. '
        'Do not change the score, fit label, or target level. '
        'Return exactly two short lines beginning with Summary: and Recommendation:\n'
        f'Score: {score}\n'
        f'Fit: {fit}\n'
        f'Target level: {level}\n'
        f'Matched skills: {", ".join(matched) or "None"}\n'
        f'Missing skills: {", ".join(missing) or "None"}\n'
        f'Relevant projects: {", ".join(project.name for project in projects) or "None"}'
    )

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {'role': 'system', 'content': 'You write professional, concise recruiter summaries.'},
                {'role': 'user', 'content': prompt},
            ],
            temperature=0.2,
            max_tokens=220,
        )

        text = completion.choices[0].message.content.strip()

        summary = fallback[0]
        recommendation = fallback[1]

        for line in text.splitlines():
            if line.lower().startswith('summary:'):
                summary = line.split(':', 1)[1].strip()
            elif line.lower().startswith('recommendation:'):
                recommendation = line.split(':', 1)[1].strip()

        return summary, recommendation

    except (RateLimitError, Exception):
        return fallback


def analyze_jd(text: str, file_name: str) -> JDAnalysisResponse:
    profile = _load_json("profile.json")
    projects = _load_json("projects.json").get("projects", [])

    required_skills = extract_required_skills(text)
    candidate_skills = _candidate_skills(profile, projects)
    matched = [skill for skill in required_skills if skill in candidate_skills]
    missing = [skill for skill in required_skills if skill not in candidate_skills]

    required_skill_match = len(matched) / len(required_skills) if required_skills else 0.0
    project_relevance, relevant_projects = _project_relevance(required_skills, projects)
    experience_relevance = _experience_relevance(required_skills, profile, projects)
    communication_bonus = 1.0

    score = round(100 * (
        0.55 * required_skill_match +
        0.25 * project_relevance +
        0.15 * experience_relevance +
        0.05 * communication_bonus
    ))
    score = max(0, min(100, score))
    fit = _fit(score)

    matched_display = [DISPLAY_SKILLS[skill] for skill in matched]
    missing_display = [DISPLAY_SKILLS[skill] for skill in missing]
    level = _target_level(text)

    summary, recommendation = _generate_summary(
        score,
        fit,
        matched_display,
        missing_display,
        relevant_projects,
        level,
    )

    return JDAnalysisResponse(
        job_title=_job_title(text),
        file_name=file_name,
        score=score,
        fit=fit,
        matched_skills=matched_display,
        missing_skills=missing_display,
        relevant_projects=relevant_projects,
        summary=summary,
        recommendation=recommendation,
    )
