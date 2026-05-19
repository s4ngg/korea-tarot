import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

GPT_MODEL = "gpt-4o-mini"

_SYSTEM_PROMPT = """당신은 전문 타로 상담사입니다.
사용자의 고민과 선택한 카드의 의미를 바탕으로
따뜻하고 통찰력 있는 상담 결과를 제공하세요.
결과는 500자 내외로 작성하세요."""


def _build_user_prompt(concern: str, card_contexts: list[str]) -> str:
    card_sections = "\n\n".join(
        f"[카드 {i + 1}]\n{ctx}" for i, ctx in enumerate(card_contexts)
    )
    return (
        f"사용자의 고민: {concern}\n\n"
        f"선택한 카드 정보:\n{card_sections}\n\n"
        "위 내용을 바탕으로 타로 상담 결과를 생성해주세요."
    )


def generate_interpretation(concern: str, card_contexts: list[str]) -> str:
    response = _client.chat.completions.create(
        model=GPT_MODEL,
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_prompt(concern, card_contexts)},
        ],
        temperature=0.7,
        max_tokens=1000,
    )
    return response.choices[0].message.content
