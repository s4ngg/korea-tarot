# Korea Tarot — 서비스 전체 개요

## 1. 서비스 소개

사용자가 고민을 입력하고 타로 카드 3장을 선택하면, RAG 기반 AI가 카드 의미와 고민을 결합해 개인 맞춤형 해석 결과를 제공하는 웹 서비스.

---

## 2. 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Frontend | React + Vite | React 19 |
| 상태 관리 | Zustand | v5 |
| 서버 상태 | TanStack Query | v5 |
| HTTP | Axios | - |
| Backend | Spring Boot | 4.0.x |
| 언어 | Java | 21 |
| ORM | Spring Data JPA (Hibernate) | - |
| DB | MySQL | 8.x |
| 캐시/세션 | Redis | 7.x |
| 인증 | Spring Security + jjwt | 0.12.x |
| 메일 | Spring JavaMailSender (Gmail SMTP) | - |
| AI Server | FastAPI | 0.115.x |
| AI 언어 | Python | 3.11 |
| 임베딩 | OpenAI text-embedding-3-small | dim=1536 |
| LLM | OpenAI GPT-4o-mini | - |
| 벡터 DB | FAISS | IndexFlatIP |
| CSS | CSS Modules | - |

---

## 3. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React)                      │
│   - Zustand (auth state)                               │
│   - TanStack Query (server state)                      │
│   - Axios (HTTP, JWT Bearer 자동 첨부)                  │
└───────────────────┬─────────────────────────────────────┘
                    │ HTTPS (localhost:5173 → :8080)
                    │
┌───────────────────▼─────────────────────────────────────┐
│              Spring Boot :8080                          │
│   - Spring Security (JWT Filter Chain)                 │
│   - REST API (JSON)                                    │
│   - Spring RestClient (AI Server 호출)                 │
└──────┬─────────────────────────┬────────────────────────┘
       │                         │
┌──────▼──────┐         ┌────────▼────────┐
│  MySQL :3306│         │  Redis :6379    │
│  - users    │         │  - email:verify │
│  - tarot_cards        │  - refresh:     │
│  - tarot_readings     └─────────────────┘
│  - reading_cards│
└─────────────────┘
       │
┌──────▼──────────────────────────────────────────────────┐
│              FastAPI :8000                              │
│   POST /ai/interpret — 타로 해석 생성                   │
│   POST /ai/vectorize — 카드 벡터 인덱싱                 │
└──────┬─────────────────────────────────────────────────┘
       │
┌──────▼────────────────────────┐
│  OpenAI API                   │
│  - text-embedding-3-small     │
│  - gpt-4o-mini                │
└───────────────────────────────┘
       │ FAISS 로컬 파일
┌──────▼──────────┐
│  faiss_index/   │
│  tarot.index    │
│  metadata.pkl   │
└─────────────────┘
```

---

## 4. 사용자 시나리오 (Happy Path)

### 4-1. 회원가입 → 이메일 인증 → 로그인

```
사용자                   Frontend              Backend               Redis/Mail
  │  닉네임/이메일/PW 입력 │                     │                      │
  │─────────────────────▶ │ POST /api/auth/signup│                      │
  │                       │─────────────────────▶│ BCrypt 암호화         │
  │                       │                     │ users 테이블 저장     │
  │                       │                     │ 인증코드 생성(6자리)  │
  │                       │                     │──────────────────────▶│ Redis SET email:verify:{email}
  │                       │                     │ Gmail SMTP 발송       │
  │                       │ 200 OK               │                      │
  │  인증코드 입력         │─────────────────────◀│                      │
  │─────────────────────▶ │ POST /api/auth/email/verify                 │
  │                       │─────────────────────▶│──────────────────────▶│ Redis GET
  │                       │                     │ email_verified = true │
  │                       │ 200 OK               │                      │
  │  이메일/PW 입력        │─────────────────────◀│                      │
  │─────────────────────▶ │ POST /api/auth/login │                      │
  │                       │─────────────────────▶│ Access Token 발급    │
  │                       │                     │ Refresh Token 발급   │
  │                       │                     │──────────────────────▶│ Redis SET refresh:{userId}
  │  accessToken 저장      │ 200 + Cookie(refresh)│                      │
  │  (localStorage)        │─────────────────────◀│                      │
```

### 4-2. 타로 상담

```
사용자              Frontend           Backend            AI Server         OpenAI
  │ 고민 입력 + 카드 3장 선택         │                   │                  │
  │────────────────▶ │ POST /api/tarot/reading            │                  │
  │                  │──────────────▶ │ 카드 ID 조회       │                  │
  │                  │               │ POST /ai/interpret │                  │
  │                  │               │──────────────────▶│ FAISS 검색        │
  │                  │               │                   │─────────────────▶│ Embedding
  │                  │               │                   │◀─────────────────│
  │                  │               │                   │ GPT Prompt 생성  │
  │                  │               │                   │─────────────────▶│ Chat Completion
  │                  │               │                   │◀─────────────────│ interpretation
  │                  │               │◀──────────────────│                  │
  │                  │               │ tarot_readings 저장│                  │
  │                  │               │ reading_cards 저장 │                  │
  │  결과 페이지 이동 │◀──────────────│ { reading }       │                  │
  │◀─────────────────│               │                   │                  │
```

---

## 5. 주요 기능 목록

| # | 기능 | 설명 | 인증 필요 |
|---|------|------|-----------|
| 1 | 회원가입 | 닉네임/이메일/비밀번호 입력, 이메일 인증 코드 발송 | X |
| 2 | 이메일 인증 | 6자리 코드 입력, TTL 5분 | X |
| 3 | 로그인 | Access Token + Refresh Token 발급 | X |
| 4 | 로그아웃 | Redis Refresh Token 삭제 | O |
| 5 | 내 정보 조회 | 닉네임, 이메일 | O |
| 6 | 내 정보 수정 | 닉네임 / 비밀번호 변경 | O |
| 7 | 타로 카드 목록 | 78장 전체 목록 | X |
| 8 | 타로 상담 | 고민 입력 + 카드 3장 선택 → AI 해석 | O |
| 9 | 상담 기록 목록 | 최신순, 본인 기록만 | O |
| 10 | 상담 기록 상세 | 카드 + 해석 전문 | O |
| 11 | 상담 기록 삭제 | 본인 기록만 | O |

---

## 6. 비기능 요구사항

| 항목 | 요구사항 |
|------|----------|
| 보안 | JWT 토큰 검증 실패 시 401, 권한 없음 시 403 반환 |
| 보안 | Refresh Token은 httpOnly Cookie (JS 접근 불가) |
| 보안 | 비밀번호 BCrypt 해싱 |
| 보안 | 타인의 상담 기록 접근 시 403 반환 |
| 가용성 | AI 서버 호출 실패 시 BusinessException으로 처리 |
| 응답형식 | 모든 API `ApiResponse<T>` 공통 포맷 준수 |
| 인증코드 | Redis TTL 5분, 만료 시 재발송 필요 |
| 로깅 | System.out.println 금지, Log4j2 사용 |
| 난수 | SecureRandom 사용 (인증코드 생성) |

---

## 7. 디자인 시스템

| 항목 | 값 |
|------|----|
| `--color-background` | `#131313` |
| `--color-primary` | `#0F051D` |
| `--color-accent` | `#C9A84C` |
| `--color-accent-bright` | `#e6c364` |
| `--color-text` | `#e5e2e1` |
| `--color-text-muted` | `#cbc4cd` |
| `--color-surface` | `#201f1f` |
| `--color-error` | `#ffb4ab` |
| `--font-heading` | `'Playfair Display', serif` |
| `--font-body` | `'Manrope', sans-serif` |
| `--spacing-unit` | `8px` |
| `--container-max` | `1280px` |
| `--border-radius` | `4px` |

**글로벌 스타일 특징**
- glassmorphism 카드: `rgba(15,5,29,0.6)` + `backdrop-filter: blur(20px)` + 금색 테두리
- 금색 그라디언트 버튼: `linear-gradient(135deg, #C9A84C, #9E7D2E)`
- Starfield: canvas 기반 금색 별빛 애니메이션 (fixed 배경)
- 모든 헤더 `position: fixed`, glassmorphism 처리

---

## 8. 라우팅 구조

```
/                        → MainPage (공개)
/login                   → LoginPage (공개)
/signup                  → SignupPage (공개)
/signup/verify           → SignupVerifyPage (공개)
/tarot                   → TarotPage (PrivateRoute)
/tarot/result            → TarotResultPage (PrivateRoute)
/mypage                  → MyPage (PrivateRoute)
/mypage/readings         → ReadingListPage (PrivateRoute)
/mypage/readings/:id     → ReadingDetailPage (PrivateRoute)
*                        → NotFoundPage (공개)
```
