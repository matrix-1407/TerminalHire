from pydantic import BaseModel, Field
from typing import List


class Identity(BaseModel):
    full_name: str
    professional_title: str
    current_city: str
    hometown: str
    open_to_relocation: str
    preferred_work_mode: List[str]


class Education(BaseModel):
    institution: str
    location: str
    degree: str
    start_year: int
    graduation_year: int
    cgpa: float
    university: str


class Skill(BaseModel):
    confidence: float = Field(ge=0, le=5)
    level: str


class CandidateProfile(BaseModel):
    identity: Identity
    education: Education
    career: dict
    skills: dict[str, Skill]
    experience: list[dict]
    technical_involvement: list[dict]
    achievements: list[str]
    certifications: list[str]
    professional_experience: list[dict]
    social_links: dict
    career_statement: str