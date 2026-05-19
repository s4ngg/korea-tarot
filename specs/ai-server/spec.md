# AI Server 스펙

## 1. 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | FastAPI | 0.115.x |
| 언어 | Python | 3.11 |
| 임베딩 모델 | OpenAI text-embedding-3-small | dim=1536 |
| LLM | OpenAI GPT-4o-mini | - |
| 벡터 DB | FAISS (IndexFlatIP) | faiss-cpu |
| 벡터 직렬화 | pickle | - |
| 환경변수 | python-dotenv | - |

---

## 2. 디렉토리 구조

```
ai-server/
├── main.py                # FastAPI 앱, lifespan 훅
├── routers/
│   ├── interpret.py       # POST /ai/interpret
│   └── vectorize.py       # POST /ai/vectorize
├── services/
│   ├── rag_service.py     # FAISS 인덱스 구축 및 검색
│   └── gpt_service.py     # GPT 프롬프트 생성 및 호출
├── data/
│   └── tarot_cards.json   # 78장 카드 원본 데이터
├── faiss_index/           # 빌드된 인덱스 저장 (git 제외)
│   ├── tarot.index        # FAISS 인덱스 파일
│   └── metadata.pkl       # 카드명 ↔ 벡터 ID 매핑
├── requirements.txt
├── .env                   # 실제 환경변수 (git 제외)
└── .env.example           # 환경변수 템플릿
```

---

## 3. 카드 데이터 스키마 (`tarot_cards.json`)

```json
[
  {
    "id": 1,
    "name": "The Fool",
    "name_kr": "광대",
    "arcana_type": "MAJOR",
    "suit": null,
    "number": 0,
    "upright_meaning": "새로운 시작, 모험, 자유로운 영혼",
    "reversed_meaning": "무모함, 위험한 행동, 미성숙",
    "symbols": ["흰 장미", "벼랑 끝", "작은 개", "배낭"],
    "description": "광대는 여정의 시작점에 서 있습니다..."
  }
]
```

**총 78장 구성:**
- Major Arcana: 22장 (The Fool ~ The World, number 0~21)
- Minor Arcana: 56장 (Ace~King × 4 Suit)
  - Wands: 14장 (불, 창의성, 열정)
  - Cups: 14장 (물, 감정, 관계)
  - Swords: 14장 (공기, 사고, 갈등)
  - Pentacles: 14장 (땅, 물질, 현실)

---

## 4. 환경변수

```bash
# .env.example
OPENAI_API_KEY=sk-...
FAISS_INDEX_PATH=./faiss_index
```

---

## 5. 서버 시작 흐름 (lifespan)

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    if not is_index_built():          # faiss_index/ 파일 존재 여부 확인
        count = build_and_save_index()  # 78장 벡터화 + 저장
        logger.info(f"벡터 인덱스 구축 완료: {count}장")
    else:
        logger.info("기존 벡터 인덱스 로드")
    yield
    # shutdown (정리 작업 없음)
```

---

## 6. RAG 파이프라인 상세

### 6-1. 인덱스 구축 (`build_and_save_index`)

```
1. tarot_cards.json 로드
2. 각 카드에 대해 build_card_document(card) 호출
   → "카드명: The Fool (광대)\n정방향: ...\n역방향: ...\n상징: ...\n설명: ..."
3. OpenAI text-embedding-3-small 배치 임베딩
   → shape: (78, 1536)
4. faiss.normalize_L2(vectors)  # L2 정규화 → IndexFlatIP = 코사인 유사도
5. IndexFlatIP(1536).add(vectors)
6. faiss_index/tarot.index 저장
7. faiss_index/metadata.pkl 저장 (list[str]: 카드명 순서)
```

### 6-2. 카드 검색 (`search_card_contexts`)

```
입력: card_names: list[str]  (e.g. ["The Fool", "The Lovers", "Wheel of Fortune"])

각 카드명에 대해:
1. OpenAI text-embedding-3-small 임베딩
2. faiss.normalize_L2(query_vector)
3. index.search(query_vector, k=1)  → top-1 유사 카드 컨텍스트
4. metadata[idx] → 카드명 → 원본 문서 반환

반환: list[str] (카드별 컨텍스트 문서 3개)
```

### 6-3. GPT 호출 (`generate_interpretation`)

```
입력:
  - concern: str (사용자 고민)
  - card_contexts: list[str] (카드 컨텍스트 3개)

시스템 프롬프트:
  "당신은 전문 타로 상담사입니다.
   사용자의 고민과 선택한 카드의 의미를 바탕으로
   따뜻하고 통찰력 있는 상담 결과를 제공하세요.
   결과는 500자 내외로 작성하세요."

유저 메시지:
  "사용자 고민: {concern}
   
   선택한 카드:
   1. {card_contexts[0]}
   2. {card_contexts[1]}
   3. {card_contexts[2]}"

모델: gpt-4o-mini
반환: interpretation (str)
```

---

## 7. API 명세

### `POST /ai/interpret` — 타로 해석 생성

- 호출자: Spring Boot (RestClient)
- 인증: 없음 (내부 서버 간 통신)

**Request Body:**
```json
{
  "concern_text": "연애 문제로 고민 중입니다.",
  "cards": ["The Fool", "The Lovers", "Wheel of Fortune"]
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `concern_text` | string | O | 사용자 고민 (Spring의 `@JsonProperty("concern_text")` 매핑) |
| `cards` | list[str] | O | 카드 영문명 배열 (정확히 3개) |

**Response `200`:**
```json
{
  "interpretation": "당신의 과거에서 나타난 광대 카드는..."
}
```

**에러 Response:**
```json
{ "detail": "카드 이름 목록이 비어있습니다." }   // 400
{ "detail": "AI 서버 내부 오류" }               // 500
```

---

### `POST /ai/vectorize` — 카드 벡터 인덱스 재구축

- 호출자: 수동 (관리자) 또는 서버 시작 시 자동
- 인증: 없음

**Request Body:** 없음

**Response `200`:**
```json
{ "message": "벡터화 완료", "count": 78 }
```

---

## 8. Spring Boot ↔ AI Server 연동

**Spring Boot 측 (`AiInterpretRequestDto`)**
```java
public class AiInterpretRequestDto {
    @JsonProperty("concern_text")
    private String concernText;
    private List<String> cards;
}
```

**Spring Boot RestClient 호출 예시**
```java
AiInterpretResponseDto response = aiRestClient
    .post()
    .uri("/ai/interpret")
    .body(requestDto)
    .retrieve()
    .body(AiInterpretResponseDto.class);
```

- AI 서버 baseURL: `http://localhost:8000` (application.yml `ai.server.url`)
- 타임아웃: 30초 권장 (GPT 응답 지연 대비)
- 실패 시: `BusinessException(ErrorCode.AI_SERVER_ERROR)` → 502

---

## 9. 개발/실행 방법

```bash
# 가상환경
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# .env 설정
cp .env.example .env
# OPENAI_API_KEY=sk-... 입력

# 서버 실행 (포트 8000)
uvicorn main:app --reload --port 8000
```

**requirements.txt**
```
fastapi
uvicorn[standard]
openai
faiss-cpu
numpy
python-dotenv
```
