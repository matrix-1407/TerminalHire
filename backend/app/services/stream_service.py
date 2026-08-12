import asyncio
from groq import RateLimitError

from app.services.groq_service import client, model
from app.prompts.prompt_builder import build_system_prompt


async def stream_response(message: str, history: list):
    system_prompt = build_system_prompt()

    messages = [
        {
            "role": "system",
            "content": system_prompt
        }
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

    try:
        stream = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.3,
            max_tokens=700,
            top_p=0.9,
            stream=True,
        )

        for chunk in stream:
            delta = chunk.choices[0].delta.content or ""
            if delta:
                yield delta
                await asyncio.sleep(0)

    except RateLimitError:
        yield "TerminalHire has temporarily reached the daily Groq API limit. Please try again later."