from io import BytesIO
from pathlib import Path

from docx import Document
from pypdf import PdfReader


MAX_FILE_SIZE = 5 * 1024 * 1024
MAX_ANALYSIS_CHARS = 25_000
SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".txt"}


class JDParseError(ValueError):
    pass


def validate_file(file_name: str, content: bytes) -> str:
    extension = Path(file_name or "").suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise JDParseError("Please upload a PDF, DOCX, or TXT job description.")

    if len(content) > MAX_FILE_SIZE:
        raise JDParseError("The job description must be 5 MB or smaller.")

    if not content:
        raise JDParseError("The uploaded file appears to be empty.")

    return extension


def extract_text(file_name: str, content: bytes) -> str:
    extension = validate_file(file_name, content)

    try:
        if extension == ".txt":
            text = content.decode("utf-8", errors="ignore")
        elif extension == ".pdf":
            reader = PdfReader(BytesIO(content))
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
        else:
            document = Document(BytesIO(content))
            text = "\n".join(paragraph.text for paragraph in document.paragraphs)
    except Exception as exc:
        raise JDParseError("Could not extract text from this file. Please try another JD file.") from exc

    text = " ".join(text.split())

    if not text:
        raise JDParseError("No readable text was found in the uploaded job description.")

    return text[:MAX_ANALYSIS_CHARS]
