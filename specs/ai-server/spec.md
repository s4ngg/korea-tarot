# AI Server 스펙

## 기술 스택
- FastAPI
- OpenAI API (GPT-4o-mini, Embedding)
- FAISS
- Python 3.11

---

## 디렉토리 구조

```
ai-server/
├── main.py
├── routers/
│   ├── interpret.py       # 타로 해석 API
│   └── vectorize.py       # 카드 문서 벡터화 API
├── services/
│   ├── rag_service.py     # RAG 파이프라인
│   └── gpt_service.py     # GPT 프롬프트 생성 및 호출
├── data/
│   └── tarot_cards.json   # 78장 카드 설명 데이터
├── faiss_index/           # FAISS 인덱스 저장 폴더
├── requirements.txt
└── .env
```

---

## API 명세

### POST /ai/interpret
- 설명: 카드 + 고민 기반 타로 해석 생성
- Request (Spring Boot에서 호출):
```json
{
  "concern": "연애 문제로 고민 중입니다.",
  "cards": ["The Lovers", "The Hermit", "Wheel of Fortune"]
}
```
- Response:
```json
{
  "interpretation": "AI가 생성한 타로 해석 결과 텍스트..."
}
```

### POST /ai/vectorize
- 설명: 타로 카드 설명 문서를 FAISS에 벡터 인덱싱
- 서버 최초 실행 시 1회 호출
- Response: `{ "message": "벡터화 완료", "count": 78 }`

---

## RAG 파이프라인 흐름

```
1. [카드 데이터 준비]
   tarot_cards.json에 78장 카드 설명 저장
   (카드명, 정방향 의미, 역방향 의미, 상징)

2. [임베딩 생성 - 최초 1회]
   OpenAI text-embedding-3-small 모델 사용
   각 카드 설명 → 벡터 변환

3. [FAISS 인덱싱]
   생성된 벡터를 FAISS에 저장
   faiss_index/ 폴더에 인덱스 파일 유지

4. [상담 요청 수신]
   Spring Boot → POST /ai/interpret 호출
   { concern, cards } 수신

5. [관련 문서 검색]
   선택된 카드 3장 이름으로 FAISS 유사도 검색
   카드별 상세 설명 컨텍스트 추출

6. [GPT 프롬프트 생성]
   시스템 프롬프트 + 카드 컨텍스트 + 사용자 고민 조합

7. [GPT 해석 생성]
   GPT-4o-mini 호출
   자연어 상담 결과 생성

8. [결과 반환]
   { interpretation } → Spring Boot 반환
```

---

## GPT 프롬프트 예시

```
[시스템]
당신은 전문 타로 상담사입니다.
사용자의 고민과 선택한 카드의 의미를 바탕으로
따뜻하고 통찰력 있는 상담 결과를 제공하세요.
결과는 500자 내외로 작성하세요.

[유저]
사용자의 고민: 연애 문제로 고민 중입니다.

선택한 카드와 의미:
1. The Lovers - 관계와 선택, 가치관의 조화
2. The Hermit - 내면 성찰, 고독 속의 지혜
3. Wheel of Fortune - 변화의 흐름, 운명의 전환점

위 내용을 바탕으로 타로 상담 결과를 생성해주세요.
```

---

## 환경 변수 (.env)

```
OPENAI_API_KEY=sk-...
FAISS_INDEX_PATH=./faiss_index
```
