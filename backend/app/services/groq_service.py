import os

from dotenv import load_dotenv
from groq import Groq

from app.prompts.prompt_builder import build_system_prompt

load_dotenv()

my_api_key = os.getenv("GROQ_API_KEY")

if not my_api_key:
    raise ValueError("GROQ_API_KEY not found in backend/.env")

client = Groq(
    api_key=my_api_key,
    timeout=30
)

model = "llama-3.3-70b-versatile"


def generate_response(message: str, history: list):
    system_prompt = build_system_prompt()

    messages = [
        {"role": "system", "content": system_prompt}
    ]

    for msg in history[-10:]:
        messages.append({
            "role": msg.role,
            "content": msg.content
        })

    messages.append({
        "role": "user",
        "content": message
    })

    completion = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.3,
        max_tokens=400,
        top_p=0.9,
    )

    return completion.choices[0].message.content