# Korea Tarot — 서비스 전체 개요 명세

## 1. 서비스 개요

### 1-1. 목적

사용자가 고민을 입력하고 타로 카드 3장을 선택하면, RAG 기반 AI가 카드 의미와 고민을 결합해 개인 맞춤형 해석 결과를 생성·저장하는 웹 서비스.

### 1-2. 대상 사용자

- 타로에 관심이 있는 일반 사용자
- 인증된 회원만 상담 및 기록 기능 이용 가능

---

## 2. 기능 요구사항 (Functional Requirements)

| ID | 기능 | 설명 | 인증 |
|----|------|------|------|
| FR-01 | 회원가입 | 닉네임/이메일/비밀번호 입력 후 이메일 인증코드 발송 | 불필요 |
| FR-02 | 이메일 인증 | 수신한 6자리 코드 입력으로 계정 활성화 | 불필요 |
| FR-03 | 로그인 | 이메일/비밀번호로 인증, Access/Refresh Token 발급 | 불필요 |
| FR-04 | 로그아웃 | Refresh Token 무효화 | 필요 |
| FR-05 | 내 정보 조회 | 닉네임, 이메일 확인 | 필요 |
| FR-06 | 내 정보 수정 | 닉네임 또는 비밀번호 변경 | 필요 |
| FR-07 | 타로 카드 목록 조회 | 78장 카드 전체 목록 | 불필요 |
| FR-08 | 타로 상담 | 고민 텍스트 + 카드 3장 선택 → AI 해석 결과 생성 및 저장 | 필요 |
| FR-09 | 상담 기록 목록 | 본인의 상담 기록 최신순 목록 | 필요 |
| FR-10 | 상담 기록 상세 | 카드 정보 + 해석 전문 | 필요 |
| FR-11 | 상담 기록 삭제 | 본인 기록만 삭제 가능 | 필요 |

---

## 3. 비기능 요구사항 (Non-Functional Requirements)

| ID | 분류 | 요구사항 |
|----|------|----------|
| NFR-01 | 보안 | 비밀번호는 BCrypt로 해싱하여 저장, 평문 저장 금지 |
| NFR-02 | 보안 | Refresh Token은 httpOnly Cookie로 전달, JS에서 접근 불가 |
| NFR-03 | 보안 | 타인의 상담 기록 접근 시 403 반환 |
| NFR-04 | 보안 | JWT 검증 실패 시 401, 권한 부족 시 403 반환 |
| NFR-05 | 보안 | 이메일 인증코드 생성에 SecureRandom 사용 |
| NFR-06 | 가용성 | AI 서버 호출 실패 시 502로 처리, 서비스 전체 중단 방지 |
| NFR-07 | 응답 | 모든 API는 `{ success, message, data }` 공통 포맷 준수 |
| NFR-08 | 일관성 | 인증코드 TTL 5분, 만료 후 재발송 필요 |
| NFR-09 | 로깅 | `System.out.println` 금지, Log4j2 사용 |
| NFR-10 | 성능 | 타로 카드 목록 조회는 DB 쿼리 결과를 클라이언트 캐시(staleTime 무한) |
| NFR-11 | 성능 | 상담 기록 목록 조회 시 N+1 쿼리 방지 (JPQL JOIN FETCH) |

---

## 4. 기술 스택

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
| 스타일 | CSS Modules | - |

---

## 5. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React)                      │
│   - Zustand (auth state)                               │
│   - TanStack Query (server state)                      │
│   - Axios (HTTP, JWT Bearer 자동 첨부)                  │
└───────────────────┬─────────────────────────────────────┘
                    │ HTTP (localhost:5173 → :8080)
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
└────────┬────────┘
         │ RestClient
┌────────▼────────────────────────────────────────────────┐
│              FastAPI :8000                              │
│   POST /ai/interpret — 타로 해석 생성                   │
│   POST /ai/vectorize — 카드 벡터 인덱싱                 │
└────────┬────────────────────────────────────────────────┘
         │
┌────────▼──────────────┐     ┌──────────────┐
│  OpenAI API           │     │  FAISS 로컬  │
│  - text-embedding-... │     │  tarot.index │
│  - gpt-4o-mini        │     │  metadata.pkl│
└───────────────────────┘     └──────────────┘
```

---

## 6. 유저 스토리

| ID | 역할 | 원하는 것 | 이유 |
|----|------|-----------|------|
| US-01 | 비회원 | 이메일로 회원가입을 하고 싶다 | 서비스를 이용하기 위해 |
| US-02 | 비회원 | 이메일 인증을 통해 계정을 활성화하고 싶다 | 보안 강화 및 본인 확인을 위해 |
| US-03 | 비회원 | 이메일/비밀번호로 로그인하고 싶다 | 내 계정에 접근하기 위해 |
| US-04 | 회원 | 고민을 입력하고 카드 3장을 선택해 AI 해석을 받고 싶다 | 타로를 통해 고민에 대한 통찰을 얻기 위해 |
| US-05 | 회원 | 과거 상담 기록을 다시 볼 수 있어야 한다 | 이전 해석 내용을 돌아보기 위해 |
| US-06 | 회원 | 불필요한 상담 기록을 삭제하고 싶다 | 기록을 관리하기 위해 |
| US-07 | 회원 | 닉네임을 수정하고 싶다 | 표시 이름을 바꾸기 위해 |

---

## 7. 주요 플로우 (시퀀스 다이어그램)

### 7-1. 회원가입 → 이메일 인증 → 로그인

```
사용자              Frontend           Backend              Redis/Mail
  │ 닉네임/이메일/PW  │                  │                     │
  │──────────────────▶│ POST /api/auth/signup                  │
  │                  │──────────────────▶│ BCrypt 해싱          │
  │                  │                  │ users INSERT         │
  │                  │                  │ 인증코드 6자리 생성   │
  │                  │                  │─────────────────────▶│ Redis SET TTL 5분
  │                  │                  │ Gmail SMTP 발송      │
  │                  │◀──────────────────│ 200 OK              │
  │ 인증코드 입력     │                  │                     │
  │──────────────────▶│ POST /api/auth/email/verify            │
  │                  │──────────────────▶│─────────────────────▶│ Redis GET
  │                  │                  │ email_verified=true  │
  │                  │◀──────────────────│ 200 OK              │
  │ 이메일/PW 입력    │                  │                     │
  │──────────────────▶│ POST /api/auth/login                   │
  │                  │──────────────────▶│ Access/Refresh 발급 │
  │                  │                  │─────────────────────▶│ Redis SET TTL 7일
  │◀──────────────────│ 200 + Cookie(refresh)                  │
```

### 7-2. 타로 상담

```
사용자         Frontend        Backend          AI Server        OpenAI
  │ 고민+카드3장│               │                │                │
  │────────────▶│ POST /api/tarot/reading        │                │
  │            │───────────────▶│ 카드 엔티티 조회│                │
  │            │               │ POST /ai/interpret              │
  │            │               │───────────────▶│ FAISS 검색      │
  │            │               │               │────────────────▶│ Embedding
  │            │               │               │◀────────────────│
  │            │               │               │ GPT Prompt 생성 │
  │            │               │               │────────────────▶│ Chat
  │            │               │               │◀────────────────│ interpretation
  │            │               │◀───────────────│                │
  │            │               │ DB 저장         │                │
  │◀────────────│◀───────────────│ { reading }   │                │
```

---

## 8. 라우팅 구조

| 경로 | 페이지 | 인증 |
|------|--------|------|
| `/` | MainPage | X |
| `/login` | LoginPage | X |
| `/signup` | SignupPage | X |
| `/signup/verify` | SignupVerifyPage | X |
| `/tarot` | TarotPage | O (PrivateRoute) |
| `/tarot/result` | TarotResultPage | O (PrivateRoute) |
| `/mypage` | MyPage | O (PrivateRoute) |
| `/mypage/readings` | ReadingListPage | O (PrivateRoute) |
| `/mypage/readings/:id` | ReadingDetailPage | O (PrivateRoute) |
| `*` | NotFoundPage | X |

---

## 9. 디자인 시스템

| 토큰 | 값 |
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
| `--container-max` | `1280px` |
| `--border-radius` | `4px` |

**공통 UI 패턴**

- glassmorphism 카드: `rgba(15,5,29,0.6)` + `backdrop-filter: blur(20px)` + `border: 1px solid rgba(201,168,76,0.2)`
- 금색 그라디언트 버튼: `linear-gradient(135deg, #C9A84C, #9E7D2E)`, 텍스트 `#3d2e00`
- Starfield: `<canvas>` 기반 금색 별 150개 opacity 반짝임 애니메이션, `position: fixed`
- 헤더: `position: fixed`, glassmorphism, 스크롤과 무관하게 상단 고정
