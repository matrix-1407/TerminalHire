import asyncio
# pyrefly: ignore [missing-import]
from groq import RateLimitError, NotFoundError, AuthenticationError

from app.services.groq_service import client, model
from app.prompts.prompt_builder import build_system_prompt
from app.services.fast_answers import get_fast_answer


async def stream_response(message: str, history: list):
    # Check fast answer first to save 100% Groq API tokens for known questions and preset commands!
    fast = get_fast_answer(message)
    if fast:
        words = fast.split(" ")
        for i in range(0, len(words), 3):
            chunk = " ".join(words[i : i + 3]) + " "
            yield chunk
            await asyncio.sleep(0.012)
        return

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
    except (NotFoundError, AuthenticationError) as e:
        yield f"AI configuration error: {str(e)}"
    except Exception as e:
        yield f"An unexpected error occurred. Please try again. ({type(e).__name__})"