from pydantic import BaseModel


class RelevantProject(BaseModel):
    name: str
    relevance: str
    reason: str


class JDAnalysisResponse(BaseModel):
    job_title: str
    file_name: str
    score: int
    fit: str
    matched_skills: list[str]
    missing_skills: list[str]
    relevant_projects: list[RelevantProject]
    summary: str
    recommendation: str
