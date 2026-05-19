# Backend 스펙

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
| HTTP Client | Spring RestClient | (Spring 6.1+) |
| 로깅 | Log4j2 | - |

---

## 2. 패키지 구조

```
src/main/java/co/kr/tarot/
├── domain/
│   ├── auth/
│   │   ├── controller/   AuthController.java
│   │   ├── service/      AuthService.java
│   │   │   └── impl/    AuthServiceImpl.java
│   │   └── dto/
│   │       ├── LoginRequestDto.java
│   │       └── LoginResponseDto.java
│   ├── user/
│   │   ├── controller/   UserController.java
│   │   ├── service/      UserService.java
│   │   │   └── impl/    UserServiceImpl.java
│   │   ├── repository/   UserRepository.java
│   │   ├── entity/       User.java
│   │   └── dto/
│   │       ├── SignupRequestDto.java
│   │       ├── EmailVerifyRequestDto.java
│   │       ├── UserProfileResponseDto.java
│   │       └── UpdateProfileRequestDto.java
│   ├── tarot/
│   │   ├── controller/   TarotController.java
│   │   ├── service/      TarotService.java
│   │   │   └── impl/    TarotServiceImpl.java
│   │   ├── repository/   TarotCardRepository.java
│   │   ├── entity/       TarotCard.java
│   │   └── dto/
│   │       ├── TarotCardResponseDto.java
│   │       ├── TarotReadingRequestDto.java
│   │       ├── TarotReadingResponseDto.java
│   │       └── AiInterpretRequestDto.java
│   └── reading/
│       ├── controller/   ReadingController.java
│       ├── service/      ReadingService.java
│       │   └── impl/    ReadingServiceImpl.java
│       ├── repository/   TarotReadingRepository.java
│       ├── entity/
│       │   ├── TarotReading.java
│       │   └── ReadingCard.java
│       └── dto/
│           ├── ReadingListResponseDto.java
│           ├── ReadingDetailResponseDto.java
│           └── ReadingCardDto.java
└── global/
    ├── config/
    │   ├── SecurityConfig.java
    │   ├── RedisConfig.java
    │   ├── RestClientConfig.java
    │   └── MailConfig.java
    ├── exception/
    │   ├── BusinessException.java
    │   ├── ErrorCode.java          (enum)
    │   └── GlobalExceptionHandler.java
    ├── response/
    │   └── ApiResponse.java        (제네릭)
    └── security/
        ├── CustomUserDetails.java
        ├── UserDetailsServiceImpl.java
        └── jwt/
            ├── JwtProvider.java
            ├── JwtAuthenticationFilter.java
            ├── JwtAuthenticationEntryPoint.java
            └── JwtAccessDeniedHandler.java
```

---

## 3. 엔티티 (ERD)

### 3-1. users

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

### 3-2. tarot_cards

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| name | VARCHAR(100) | NOT NULL | 영문 카드명 (e.g. The Fool) |
| name_kr | VARCHAR(100) | NOT NULL | 한글 카드명 (e.g. 광대) |
| arcana_type | VARCHAR(20) | NOT NULL | MAJOR / MINOR |
| suit | VARCHAR(20) | | WANDS / CUPS / SWORDS / PENTACLES (MAJOR는 NULL) |
| number | INT | | 카드 번호 |
| description | TEXT | | 카드 설명 |
| image_url | VARCHAR(255) | | 카드 이미지 URL |

### 3-3. tarot_readings

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| user_id | BIGINT | FK → users.id, NOT NULL | 상담 사용자 |
| concern_text | TEXT | NOT NULL | 사용자 고민 |
| interpretation | TEXT | NOT NULL | AI 해석 결과 |
| created_at | DATETIME | NOT NULL | 생성일 (자동) |

### 3-4. reading_cards

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| reading_id | BIGINT | FK → tarot_readings.id, NOT NULL | |
| card_id | BIGINT | FK → tarot_cards.id, NOT NULL | |
| card_order | INT | NOT NULL | 카드 순서 (1: 과거, 2: 현재, 3: 미래) |

### 3-5. 엔티티 관계

```
users ──< tarot_readings ──< reading_cards >── tarot_cards
(1:N)                        (N:1)
```

---

## 4. Redis 사용

| Key 패턴 | Value | TTL | 용도 |
|----------|-------|-----|------|
| `email:verify:{email}` | 6자리 인증코드 (String) | 5분 | 이메일 인증 |
| `refresh:{userId}` | Refresh Token (String) | 7일 | JWT 재발급 |

---

## 5. JWT 토큰

| 항목 | 값 |
|------|-----|
| Access Token TTL | 30분 |
| Refresh Token TTL | 7일 |
| 알고리즘 | HS256 |
| Access Token 저장 위치 | localStorage (프론트) |
| Refresh Token 저장 위치 | httpOnly Cookie (서버 설정) |
| Access Token 전송 방법 | `Authorization: Bearer {token}` 헤더 |

**JWT Claims (Access Token)**
```json
{
  "sub": "1",           // userId
  "email": "...",
  "iat": 1234567890,
  "exp": 1234569690
}
```

---

## 6. 에러 코드 (ErrorCode enum)

| 코드 | HTTP Status | 메시지 |
|------|-------------|--------|
| `USER_NOT_FOUND` | 404 | 사용자를 찾을 수 없습니다. |
| `DUPLICATE_EMAIL` | 409 | 이미 사용 중인 이메일입니다. |
| `INVALID_PASSWORD` | 401 | 비밀번호가 올바르지 않습니다. |
| `EMAIL_NOT_VERIFIED` | 403 | 이메일 인증이 필요합니다. |
| `INVALID_VERIFY_CODE` | 400 | 인증 코드가 올바르지 않거나 만료되었습니다. |
| `CARD_NOT_FOUND` | 404 | 타로 카드를 찾을 수 없습니다. |
| `INVALID_CARD_COUNT` | 400 | 카드는 정확히 3장이어야 합니다. |
| `READING_NOT_FOUND` | 404 | 상담 기록을 찾을 수 없습니다. |
| `READING_ACCESS_DENIED` | 403 | 본인의 상담 기록만 조회할 수 있습니다. |
| `AI_SERVER_ERROR` | 502 | AI 서버 호출에 실패했습니다. |
| `INVALID_TOKEN` | 401 | 유효하지 않은 토큰입니다. |

---

## 7. 공통 응답 형식

```java
// ApiResponse<T>
{
  "success": true | false,
  "message": "메시지",
  "data": T | null
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

**인증 오류 (401)**
```json
{ "success": false, "message": "인증이 필요합니다.", "data": null }
```

**권한 오류 (403)**
```json
{ "success": false, "message": "접근 권한이 없습니다.", "data": null }
```

---

## 8. API 명세

### 8-1. 인증 API (`/api/auth`)

#### `POST /api/auth/signup` — 회원가입
- 인증: 불필요
- Request Body:
```json
{
  "email": "test@test.com",       // 필수, 이메일 형식
  "password": "password123!",     // 필수, 8자 이상
  "nickname": "상우"              // 필수, 2~20자
}
```
- Response `200`:
```json
{ "success": true, "message": "회원가입 성공. 이메일 인증을 완료해 주세요.", "data": null }
```
- 에러: `DUPLICATE_EMAIL`(409)

---

#### `POST /api/auth/email/send` — 인증코드 발송
- 인증: 불필요
- Request Body:
```json
{ "email": "test@test.com" }
```
- 동작: SecureRandom 6자리 코드 생성 → Redis `email:verify:{email}` TTL 5분 → Gmail SMTP 발송
- Response `200`:
```json
{ "success": true, "message": "인증 코드가 발송되었습니다.", "data": null }
```

---

#### `POST /api/auth/email/verify` — 인증코드 확인
- 인증: 불필요
- Request Body:
```json
{ "email": "test@test.com", "code": "123456" }
```
- 동작: Redis GET → 일치 확인 → `users.email_verified = true` 업데이트
- Response `200`:
```json
{ "success": true, "message": "이메일 인증이 완료되었습니다.", "data": null }
```
- 에러: `INVALID_VERIFY_CODE`(400)

---

#### `POST /api/auth/login` — 로그인
- 인증: 불필요
- Request Body:
```json
{ "email": "test@test.com", "password": "password123!" }
```
- 동작:
  1. 이메일로 사용자 조회 → 없으면 `USER_NOT_FOUND`
  2. `email_verified` 확인 → `false`면 `EMAIL_NOT_VERIFIED`
  3. 비밀번호 BCrypt 비교 → 불일치면 `INVALID_PASSWORD`
  4. Access Token / Refresh Token 생성
  5. Redis `refresh:{userId}` 저장 (TTL 7일)
  6. Refresh Token을 `ResponseCookie` (httpOnly, SameSite=None, Secure) 로 Set-Cookie
- Response `200`:
```json
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer"
  }
}
```
- Set-Cookie: `refreshToken={token}; HttpOnly; Max-Age=604800; SameSite=None; Secure`

---

#### `POST /api/auth/logout` — 로그아웃
- 인증: 필요 (Bearer Token)
- 동작: Redis `refresh:{userId}` 삭제 → Cookie 만료(Max-Age=0)
- Response `200`:
```json
{ "success": true, "message": "로그아웃 완료", "data": null }
```

---

### 8-2. 유저 API (`/api/users`)

#### `GET /api/users/me` — 내 정보 조회
- 인증: 필요
- Response `200`:
```json
{
  "success": true,
  "message": "조회 성공",
  "data": {
    "email": "test@test.com",
    "nickname": "상우"
  }
}
```

---

#### `PUT /api/users/me` — 내 정보 수정
- 인증: 필요
- Request Body (부분 업데이트, 둘 다 선택적):
```json
{
  "nickname": "새닉네임",          // 선택, 2~20자
  "password": "newPassword123!"   // 선택, 8자 이상
}
```
- Response `200`:
```json
{ "success": true, "message": "수정 완료", "data": null }
```

---

### 8-3. 타로 API (`/api/tarot`)

#### `GET /api/tarot/cards` — 카드 목록 조회
- 인증: 불필요
- Response `200`:
```json
{
  "success": true,
  "message": "조회 성공",
  "data": [
    {
      "id": 1,
      "name": "The Fool",
      "nameKr": "광대",
      "arcanaType": "MAJOR",
      "suit": null,
      "number": 0,
      "imageUrl": null
    }
  ]
}
```

---

#### `POST /api/tarot/reading` — 타로 상담 요청
- 인증: 필요
- Request Body:
```json
{
  "concernText": "연애 문제로 고민 중입니다.",   // 필수, 1~500자
  "cardIds": [1, 15, 32]                         // 필수, 정확히 3개
}
```
- 동작:
  1. `cardIds` 3개 검증 (`@Size(min=3, max=3)`)
  2. TarotCard 엔티티 조회 (없으면 `CARD_NOT_FOUND`)
  3. 카드 이름 목록 + 고민 → FastAPI `POST /ai/interpret` 호출 (RestClient)
  4. 해석 결과 받아 `tarot_readings` + `reading_cards` 저장
  5. 응답 반환
- FastAPI 요청 필드: `concern_text`, `cards`
- Response `200`:
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
- 에러: `INVALID_CARD_COUNT`(400), `CARD_NOT_FOUND`(404), `AI_SERVER_ERROR`(502)

---

### 8-4. 상담 기록 API (`/api/readings`)

#### `GET /api/readings` — 기록 목록 (최신순)
- 인증: 필요
- Response `200`:
```json
{
  "success": true,
  "message": "조회 성공",
  "data": [
    {
      "id": 1,
      "concernText": "연애 문제로 고민 중입니다.",
      "cards": [
        { "cardId": 1, "cardOrder": 1, "name": "The Fool", "nameKr": "광대" }
      ],
      "createdAt": "2025-05-19T10:00:00"
    }
  ]
}
```
- JPQL fetch join으로 N+1 방지

---

#### `GET /api/readings/{id}` — 기록 상세
- 인증: 필요
- 권한: 본인 기록만 조회 가능 (`READING_ACCESS_DENIED` 403)
- Response `200`: 목록 항목 + `interpretation` 필드 포함

---

#### `DELETE /api/readings/{id}` — 기록 삭제
- 인증: 필요
- 권한: 본인 기록만 삭제 가능
- Response `200`:
```json
{ "success": true, "message": "삭제 완료", "data": null }
```

---

## 9. 시큐리티 설정

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
- CSRF: disabled (JWT 사용)
- Session: STATELESS

---

## 10. 개발 컨벤션

| 규칙 | 내용 |
|------|------|
| 예외 처리 | `throw new BusinessException(ErrorCode.XXX)` |
| 응답 | `ApiResponse.success(data)` / `ApiResponse.fail(message)` |
| 로깅 | `@Log4j2`, `System.out.println` 금지 |
| null 반환 | 금지, `orElseThrow()` 사용 |
| 서비스 구조 | `service/` 인터페이스 + `service/impl/` 구현체 |
| 비동기 | `@Async void` 금지, `CompletableFuture` 사용 |
| 난수 | `SecureRandom` 사용 |
| N+1 방지 | JPQL `JOIN FETCH` 사용 |
