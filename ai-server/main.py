from contextlib import asynccontextmanager

from fastapi import FastAPI

from routers import interpret, vectorize
from services.rag_service import build_and_save_index, is_index_built


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not is_index_built():
        print("[startup] FAISS 인덱스가 없습니다. 자동 벡터화를 시작합니다...")
        count = build_and_save_index()
        print(f"[startup] 벡터화 완료: {count}장")
    else:
        print("[startup] FAISS 인덱스 로드 완료")
    yield


app = FastAPI(title="AI Tarot Server", version="1.0.0", lifespan=lifespan)

app.include_router(interpret.router, prefix="/ai")
app.include_router(vectorize.router, prefix="/ai")


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
