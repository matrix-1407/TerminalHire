from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.jd_analyzer import analyze_jd
from app.services.jd_parser import JDParseError, extract_text


router = APIRouter(prefix="/api/jd", tags=["jd"])


@router.post("/analyze")
async def analyze_job_description(file: UploadFile = File(...)):
    content = await file.read()

    try:
        text = extract_text(file.filename or "job-description", content)
        return analyze_jd(text, file.filename or "job-description").model_dump()
    except JDParseError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="JD analysis failed. Please try again with a shorter or clearer job description.",
        ) from exc
