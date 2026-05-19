from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.gpt_service import generate_interpretation
from services.rag_service import is_index_built, search_card_contexts

router = APIRouter()


class InterpretRequest(BaseModel):
    concern_text: str
    cards: list[str]


class InterpretResponse(BaseModel):
    interpretation: str


@router.post("/interpret", response_model=InterpretResponse)
async def interpret(request: InterpretRequest) -> InterpretResponse:
    if not is_index_built():
        raise HTTPException(
            status_code=503,
            detail="벡터 인덱스가 초기화되지 않았습니다. POST /ai/vectorize를 먼저 호출해주세요.",
        )

    card_contexts = search_card_contexts(request.cards)
    interpretation = generate_interpretation(request.concern_text, card_contexts)
    return InterpretResponse(interpretation=interpretation)
