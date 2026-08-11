import os

from dotenv import load_dotenv
from groq import Groq
from groq import Groq, RateLimitError

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
    try:
        system_prompt = build_system_prompt()

        messages = [
            {"role": "system", "content": system_prompt}
        ]

        for msg in history[-6:]:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })

        messages.append({
            "role": "user",
            "content": message
        })

        # Dynamic response length
        detailed_keywords = [
            "explain", "detail", "deep", "architecture",
            "how does", "walk me through", "hardest",
            "challenge", "improve"
        ]

        lower_msg = message.lower()

        max_tokens = 700 if any(k in lower_msg for k in detailed_keywords) else 350

        completion = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.3,
            max_tokens=max_tokens,
            top_p=0.9,
        )

        return completion.choices[0].message.content
    
    except RateLimitError:
        return (
            "TerminalHire has temporarily reached the daily Groq API limit. "
            "Please try again later or try using a shorter query."
        )