# Backend 명세

## 1. 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Spring Boot | 4.0.x |
| 언어 | Java | 21 |
| 빌드 | Gradle | - |
| ORM | Spring Data JPA (Hibernate) | - |
| DB | MySQL | 8.x |
| 캐시 | Redis (Lettuce) | 7.x |
| 인증 | Spring Security + jjwt | 0.12.x |
| 메일 | Spring JavaMailSender | - |
| HTTP Client | Spring RestClient | Spring 6.1+ |
| 로깅 | Log4j2 | - |

---

## 2. 기능 요구사항

### 인증 (FR-AUTH)

| ID | 요구사항 |
|----|----------|
| FR-AUTH-01 | 이메일, 닉네임, 비밀번호를 입력받아 회원가입할 수 있어야 한다 |
| FR-AUTH-02 | 회원가입 시 이메일 중복을 검사하고, 중복이면 409를 반환해야 한다 |
| FR-AUTH-03 | 가입 후 이메일로 6자리 인증코드를 발송해야 한다 |
| FR-AUTH-04 | 인증코드는 Redis에 TTL 5분으로 저장해야 한다 |
| FR-AUTH-05 | 인증코드 확인 성공 시 `email_verified = true`로 업데이트해야 한다 |
| FR-AUTH-06 | 이메일 미인증 상태에서 로그인 시도 시 403을 반환해야 한다 |
| FR-AUTH-07 | 로그인 성공 시 Access Token(30분)과 Refresh Token(7일)을 발급해야 한다 |
| FR-AUTH-08 | Refresh Token은 httpOnly Cookie로 전달해야 한다 |
| FR-AUTH-09 | 로그아웃 시 Redis의 Refresh Token을 삭제해야 한다 |

### 유저 (FR-USER)

| ID | 요구사항 |
|----|----------|
| FR-USER-01 | 인증된 사용자는 자신의 이메일과 닉네임을 조회할 수 있어야 한다 |
| FR-USER-02 | 인증된 사용자는 닉네임 또는 비밀번호를 선택적으로 수정할 수 있어야 한다 |

### 타로 (FR-TAROT)

| ID | 요구사항 |
|----|----------|
| FR-TAROT-01 | 비인증 사용자도 78장 카드 목록을 조회할 수 있어야 한다 |
| FR-TAROT-02 | 상담 요청 시 카드 ID는 정확히 3개이어야 하며, 그렇지 않으면 400을 반환해야 한다 |
| FR-TAROT-03 | 존재하지 않는 카드 ID 전달 시 404를 반환해야 한다 |
| FR-TAROT-04 | AI 서버에 카드 이름 목록과 고민 텍스트를 전달해 해석을 받아야 한다 |
| FR-TAROT-05 | 해석 결과를 `tarot_readings`와 `reading_cards` 테이블에 저장해야 한다 |
| FR-TAROT-06 | AI 서버 호출 실패 시 502를 반환해야 한다 |

### 상담 기록 (FR-READING)

| ID | 요구사항 |
|----|----------|
| FR-READING-01 | 인증된 사용자는 자신의 상담 기록 목록을 최신순으로 조회할 수 있어야 한다 |
| FR-READING-02 | 인증된 사용자는 특정 상담 기록의 상세 내용을 조회할 수 있어야 한다 |
| FR-READING-03 | 타인의 상담 기록 접근 시 403을 반환해야 한다 |
| FR-READING-04 | 인증된 사용자는 자신의 상담 기록을 삭제할 수 있어야 한다 |

---

## 3. 입력 유효성 검사 규칙

| 필드 | 규칙 | 실패 시 |
|------|------|---------|
| `email` | 이메일 형식, NOT NULL | 400 |
| `password` (신규) | 8자 이상 | 400 |
| `nickname` | 2~20자, NOT NULL | 400 |
| `code` (인증코드) | 6자리 숫자 | 400 |
| `concernText` | 1~500자 | 400 |
| `cardIds` | 정확히 3개 | 400 (`INVALID_CARD_COUNT`) |
| `nickname` (수정) | 선택적, 2~20자 | 400 |
| `password` (수정) | 선택적, 8자 이상 | 400 |

---

## 4. 에러 코드 (ErrorCode enum)

| 코드 | HTTP Status | 메시지 | 발생 조건 |
|------|-------------|--------|-----------|
| `USER_NOT_FOUND` | 404 | 사용자를 찾을 수 없습니다. | 이메일로 사용자 조회 실패 |
| `DUPLICATE_EMAIL` | 409 | 이미 사용 중인 이메일입니다. | 회원가입 시 이메일 중복 |
| `INVALID_PASSWORD` | 401 | 비밀번호가 올바르지 않습니다. | BCrypt 비교 실패 |
| `EMAIL_NOT_VERIFIED` | 403 | 이메일 인증이 필요합니다. | 미인증 상태 로그인 |
| `INVALID_VERIFY_CODE` | 400 | 인증 코드가 올바르지 않거나 만료되었습니다. | Redis 코드 불일치 또는 TTL 만료 |
| `CARD_NOT_FOUND` | 404 | 타로 카드를 찾을 수 없습니다. | 존재하지 않는 카드 ID |
| `INVALID_CARD_COUNT` | 400 | 카드는 정확히 3장이어야 합니다. | cardIds 크기 ≠ 3 |
| `READING_NOT_FOUND` | 404 | 상담 기록을 찾을 수 없습니다. | 존재하지 않는 reading ID |
| `READING_ACCESS_DENIED` | 403 | 본인의 상담 기록만 조회할 수 있습니다. | 타인 기록 접근 |
| `AI_SERVER_ERROR` | 502 | AI 서버 호출에 실패했습니다. | RestClient 호출 실패 |
| `INVALID_TOKEN` | 401 | 유효하지 않은 토큰입니다. | JWT 검증 실패 |

---

## 5. 공통 응답 형식

```json
{
  "success": true | false,
  "message": "메시지",
  "data": { } | null
}
```

**성공 예시**
```json
{ "success": true, "message": "로그인 성공", "data": { "accessToken": "eyJ..." } }
```

**실패 예시**
```json
{ "success": false, "message": "이메일 인증이 필요합니다.", "data": null }
```

---

## 6. 데이터 모델 (ERD)

### 6-1. users

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| email | VARCHAR(100) | UNIQUE, NOT NULL | 로그인 이메일 |
| password | VARCHAR(255) | NOT NULL | BCrypt 해시 |
| nickname | VARCHAR(50) | NOT NULL | 표시 이름 |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'USER' | USER / ADMIN |
| email_verified | BOOLEAN | NOT NULL, DEFAULT FALSE | 이메일 인증 여부 |
| created_at | DATETIME | NOT NULL | 생성일 (자동) |
| updated_at | DATETIME | | 수정일 (자동) |

### 6-2. tarot_cards

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| name | VARCHAR(100) | NOT NULL | 영문 카드명 (e.g. The Fool) |
| name_kr | VARCHAR(100) | NOT NULL | 한글 카드명 (e.g. 광대) |
| arcana_type | VARCHAR(20) | NOT NULL | MAJOR / MINOR |
| suit | VARCHAR(20) | NULL 허용 | WANDS / CUPS / SWORDS / PENTACLES (MAJOR는 NULL) |
| number | INT | | 카드 번호 |
| description | TEXT | | 카드 설명 |
| image_url | VARCHAR(255) | | 카드 이미지 URL |

### 6-3. tarot_readings

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| user_id | BIGINT | FK → users.id, NOT NULL | 상담 사용자 |
| concern_text | TEXT | NOT NULL | 사용자 고민 |
| interpretation | TEXT | NOT NULL | AI 해석 결과 |
| created_at | DATETIME | NOT NULL | 생성일 (자동) |

### 6-4. reading_cards

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| reading_id | BIGINT | FK → tarot_readings.id, NOT NULL | |
| card_id | BIGINT | FK → tarot_cards.id, NOT NULL | |
| card_order | INT | NOT NULL | 1: 과거, 2: 현재, 3: 미래 |

### 6-5. 엔티티 관계

```
users (1) ──< (N) tarot_readings (1) ──< (N) reading_cards (N) >── (1) tarot_cards
```

---

## 7. Redis 사용

| Key 패턴 | Value | TTL | 용도 |
|----------|-------|-----|------|
| `email:verify:{email}` | 6자리 인증코드 (String) | 5분 | 이메일 인증 |
| `refresh:{userId}` | Refresh Token (String) | 7일 | JWT 재발급 |

---

## 8. JWT 토큰

| 항목 | 값 |
|------|----|
| Access Token TTL | 30분 |
| Refresh Token TTL | 7일 |
| 알고리즘 | HS256 |
| Access Token 저장 | localStorage (프론트) |
| Refresh Token 저장 | httpOnly Cookie |
| 전송 방법 | `Authorization: Bearer {token}` 헤더 |

**Access Token Claims**
```json
{
  "sub": "1",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234569690
}
```

---

## 9. API 명세

### 9-1. 인증 API (`/api/auth`)

#### `POST /api/auth/signup` — 회원가입

- 인증: 불필요

**Request Body**
```json
{
  "email": "test@test.com",
  "password": "password123!",
  "nickname": "상우"
}
```

| 필드 | 타입 | 필수 | 제약 |
|------|------|------|------|
| email | string | O | 이메일 형식 |
| password | string | O | 8자 이상 |
| nickname | string | O | 2~20자 |

**Response 200**
```json
{ "success": true, "message": "회원가입 성공. 이메일 인증을 완료해 주세요.", "data": null }
```

**에러 케이스**

| 조건 | 에러코드 | HTTP |
|------|----------|------|
| 이메일 중복 | DUPLICATE_EMAIL | 409 |
| 유효성 검사 실패 | - | 400 |

---

#### `POST /api/auth/email/send` — 인증코드 발송

- 인증: 불필요

**Request Body**
```json
{ "email": "test@test.com" }
```

**동작 순서**
1. SecureRandom으로 6자리 코드 생성
2. Redis `email:verify:{email}` TTL 5분으로 저장
3. Gmail SMTP로 발송

**Response 200**
```json
{ "success": true, "message": "인증 코드가 발송되었습니다.", "data": null }
```

---

#### `POST /api/auth/email/verify` — 인증코드 확인

- 인증: 불필요

**Request Body**
```json
{ "email": "test@test.com", "code": "123456" }
```

**동작 순서**
1. Redis GET `email:verify:{email}`
2. 코드 일치 확인
3. `users.email_verified = true` 업데이트

**Response 200**
```json
{ "success": true, "message": "이메일 인증이 완료되었습니다.", "data": null }
```

**에러 케이스**

| 조건 | 에러코드 | HTTP |
|------|----------|------|
| 코드 불일치 또는 TTL 만료 | INVALID_VERIFY_CODE | 400 |

---

#### `POST /api/auth/login` — 로그인

- 인증: 불필요

**Request Body**
```json
{ "email": "test@test.com", "password": "password123!" }
```

**동작 순서**
1. 이메일로 사용자 조회
2. `email_verified` 확인
3. 비밀번호 BCrypt 비교
4. Access Token / Refresh Token 생성
5. Redis `refresh:{userId}` 저장 (TTL 7일)
6. Refresh Token을 ResponseCookie (httpOnly, SameSite=None) 로 Set-Cookie

**Response 200**
```json
{
  "success": true,
  "message": "로그인 성공",
  "data": { "accessToken": "eyJ...", "tokenType": "Bearer" }
}
```

**에러 케이스**

| 조건 | 에러코드 | HTTP |
|------|----------|------|
| 사용자 없음 | USER_NOT_FOUND | 404 |
| 이메일 미인증 | EMAIL_NOT_VERIFIED | 403 |
| 비밀번호 불일치 | INVALID_PASSWORD | 401 |

---

#### `POST /api/auth/logout` — 로그아웃

- 인증: 필요 (Bearer Token)

**동작:** Redis `refresh:{userId}` 삭제 → Cookie Max-Age=0

**Response 200**
```json
{ "success": true, "message": "로그아웃 완료", "data": null }
```

---

### 9-2. 유저 API (`/api/users`)

#### `GET /api/users/me` — 내 정보 조회

- 인증: 필요

**Response 200**
```json
{
  "success": true,
  "message": "조회 성공",
  "data": { "email": "test@test.com", "nickname": "상우" }
}
```

---

#### `PUT /api/users/me` — 내 정보 수정

- 인증: 필요

**Request Body** (둘 다 선택적)
```json
{ "nickname": "새닉네임", "password": "newPassword123!" }
```

| 필드 | 타입 | 필수 | 제약 |
|------|------|------|------|
| nickname | string | X | 2~20자 |
| password | string | X | 8자 이상 |

**Response 200**
```json
{ "success": true, "message": "수정 완료", "data": null }
```

---

### 9-3. 타로 API (`/api/tarot`)

#### `GET /api/tarot/cards` — 카드 목록 조회

- 인증: 불필요

**Response 200**
```json
{
  "success": true,
  "message": "조회 성공",
  "data": [
    { "id": 1, "name": "The Fool", "nameKr": "광대", "arcanaType": "MAJOR", "suit": null, "number": 0, "imageUrl": null }
  ]
}
```

---

#### `POST /api/tarot/reading` — 타로 상담

- 인증: 필요

**Request Body**
```json
{ "concernText": "연애 문제로 고민 중입니다.", "cardIds": [1, 15, 32] }
```

| 필드 | 타입 | 필수 | 제약 |
|------|------|------|------|
| concernText | string | O | 1~500자 |
| cardIds | number[] | O | 정확히 3개 |

**동작 순서**
1. `cardIds` 크기 검증 (≠3 → `INVALID_CARD_COUNT`)
2. TarotCard 엔티티 조회 (없으면 `CARD_NOT_FOUND`)
3. FastAPI `POST /ai/interpret` 호출 (RestClient)
4. `tarot_readings` + `reading_cards` 저장
5. 응답 반환

**Response 200**
```json
{
  "success": true,
  "message": "상담 완료",
  "data": {
    "id": 1,
    "concernText": "연애 문제로 고민 중입니다.",
    "interpretation": "AI가 생성한 해석 텍스트...",
    "cards": [
      { "cardId": 1, "cardOrder": 1, "name": "The Fool", "nameKr": "광대" },
      { "cardId": 15, "cardOrder": 2, "name": "The Lovers", "nameKr": "연인" },
      { "cardId": 32, "cardOrder": 3, "name": "Wheel of Fortune", "nameKr": "운명의 수레바퀴" }
    ],
    "createdAt": "2025-05-19T10:00:00"
  }
}
```

**에러 케이스**

| 조건 | 에러코드 | HTTP |
|------|----------|------|
| cardIds 크기 ≠ 3 | INVALID_CARD_COUNT | 400 |
| 존재하지 않는 카드 ID | CARD_NOT_FOUND | 404 |
| AI 서버 호출 실패 | AI_SERVER_ERROR | 502 |

---

### 9-4. 상담 기록 API (`/api/readings`)

#### `GET /api/readings` — 목록 조회 (최신순)

- 인증: 필요

**Response 200**
```json
{
  "success": true,
  "message": "조회 성공",
  "data": [
    {
      "id": 1,
      "concernText": "연애 문제로 고민 중입니다.",
      "cards": [{ "cardId": 1, "cardOrder": 1, "name": "The Fool", "nameKr": "광대" }],
      "createdAt": "2025-05-19T10:00:00"
    }
  ]
}
```

> JPQL fetch join으로 N+1 방지

---

#### `GET /api/readings/{id}` — 상세 조회

- 인증: 필요
- 권한: 본인 기록만 조회 가능

**Response 200:** 목록 항목 + `"interpretation": "..."` 필드 포함

**에러 케이스**

| 조건 | 에러코드 | HTTP |
|------|----------|------|
| 존재하지 않는 ID | READING_NOT_FOUND | 404 |
| 타인 기록 접근 | READING_ACCESS_DENIED | 403 |

---

#### `DELETE /api/readings/{id}` — 삭제

- 인증: 필요
- 권한: 본인 기록만 삭제 가능

**Response 200**
```json
{ "success": true, "message": "삭제 완료", "data": null }
```

---

## 10. 시큐리티 설정

| 패턴 | 접근 |
|------|------|
| `POST /api/auth/signup` | 허용 |
| `POST /api/auth/email/**` | 허용 |
| `POST /api/auth/login` | 허용 |
| `GET /api/tarot/cards` | 허용 |
| 그 외 모든 요청 | 인증 필요 |

- Filter 순서: `JwtAuthenticationFilter` → `UsernamePasswordAuthenticationFilter`
- 인증 실패: `JwtAuthenticationEntryPoint` → 401
- 권한 부족: `JwtAccessDeniedHandler` → 403
- CSRF: disabled (JWT Stateless)
- Session: STATELESS

---

## 11. 패키지 구조

```
src/main/java/co/kr/tarot/
├── domain/
│   ├── auth/
│   │   ├── controller/   AuthController.java
│   │   ├── service/      AuthService.java + impl/AuthServiceImpl.java
│   │   └── dto/          LoginRequestDto, LoginResponseDto
│   ├── user/
│   │   ├── controller/   UserController.java
│   │   ├── service/      UserService.java + impl/UserServiceImpl.java
│   │   ├── repository/   UserRepository.java
│   │   ├── entity/       User.java
│   │   └── dto/          SignupRequestDto, EmailVerifyRequestDto, UserProfileResponseDto, UpdateProfileRequestDto
│   ├── tarot/
│   │   ├── controller/   TarotController.java
│   │   ├── service/      TarotService.java + impl/TarotServiceImpl.java
│   │   ├── repository/   TarotCardRepository.java
│   │   ├── entity/       TarotCard.java
│   │   └── dto/          TarotCardResponseDto, TarotReadingRequestDto, TarotReadingResponseDto, AiInterpretRequestDto
│   └── reading/
│       ├── controller/   ReadingController.java
│       ├── service/      ReadingService.java + impl/ReadingServiceImpl.java
│       ├── repository/   TarotReadingRepository.java
│       ├── entity/       TarotReading.java, ReadingCard.java
│       └── dto/          ReadingListResponseDto, ReadingDetailResponseDto, ReadingCardDto
└── global/
    ├── config/           SecurityConfig, RedisConfig, RestClientConfig, MailConfig
    ├── exception/        BusinessException, ErrorCode(enum), GlobalExceptionHandler
    ├── response/         ApiResponse<T>
    └── security/         CustomUserDetails, UserDetailsServiceImpl
        └── jwt/          JwtProvider, JwtAuthenticationFilter, JwtAuthenticationEntryPoint, JwtAccessDeniedHandler
```

---

## 12. 개발 컨벤션

| 규칙 | 내용 |
|------|------|
| 예외 처리 | `throw new BusinessException(ErrorCode.XXX)` |
| 응답 | `ApiResponse.success(data)` / `ApiResponse.fail(message)` |
| 로깅 | `@Log4j2`, `System.out.println` 금지 |
| null 반환 | 금지, `orElseThrow()` 사용 |
| 서비스 구조 | `service/` 인터페이스 + `service/impl/` 구현체 |
| 난수 | `SecureRandom` 사용 (인증코드 생성) |
| N+1 방지 | JPQL `JOIN FETCH` 사용 |
