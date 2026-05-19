from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.rag_service import build_and_save_index

router = APIRouter()


class VectorizeResponse(BaseModel):
    message: str
    count: int


@router.post("/vectorize", response_model=VectorizeResponse)
async def vectorize() -> VectorizeResponse:
    try:
        count = build_and_save_index()
        return VectorizeResponse(message="벡터화 완료", count=count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"벡터화 실패: {str(e)}")
