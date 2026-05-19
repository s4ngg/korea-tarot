# Backend 스펙

## 기술 스택
- Spring Boot / Java 21
- Spring Security + JWT
- JPA (Hibernate)
- MySQL 8
- Redis
- JavaMailSender (이메일 인증)

---

## 패키지 구조

```
src/main/java/com/tarot/
├── domain/
│   ├── auth/
│   │   ├── controller/
│   │   ├── service/impl/
│   │   ├── repository/
│   │   └── dto/
│   ├── user/
│   │   ├── controller/
│   │   ├── service/impl/
│   │   ├── repository/
│   │   └── dto/
│   ├── tarot/
│   │   ├── controller/
│   │   ├── service/impl/
│   │   ├── repository/
│   │   └── dto/
│   └── reading/
│       ├── controller/
│       ├── service/impl/
│       ├── repository/
│       └── dto/
└── global/
    ├── config/
    ├── exception/
    │   ├── BusinessException.java
    │   ├── ErrorCode.java
    │   └── GlobalExceptionHandler.java
    ├── response/
    │   └── ApiResponse.java
    └── security/
        └── jwt/
```

---

## DB 테이블

### users
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGINT PK | |
| email | VARCHAR(100) UNIQUE | 이메일 |
| password | VARCHAR(255) | BCrypt 암호화 |
| nickname | VARCHAR(50) | 닉네임 |
| role | VARCHAR(20) | USER / ADMIN |
| email_verified | BOOLEAN | 이메일 인증 여부 |
| created_at | DATETIME | 생성일 |

### tarot_cards
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGINT PK | |
| name | VARCHAR(100) | 카드 이름 |
| arcana_type | VARCHAR(20) | MAJOR / MINOR |
| description | TEXT | 카드 설명 |
| image_url | VARCHAR(255) | 카드 이미지 URL |

### tarot_readings
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGINT PK | |
| user_id | BIGINT FK | users.id |
| concern_text | TEXT | 고민 내용 |
| interpretation | TEXT | AI 해석 결과 |
| created_at | DATETIME | 생성일 |

### reading_cards
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGINT PK | |
| reading_id | BIGINT FK | tarot_readings.id |
| card_id | BIGINT FK | tarot_cards.id |
| card_order | INT | 카드 순서 (1~3) |

---

## Redis 사용 항목

| Key 패턴 | Value | TTL | 용도 |
|----------|-------|-----|------|
| `email:verify:{email}` | 인증코드 | 5분 | 이메일 인증 |
| `refresh:{userId}` | Refresh Token | 7일 | JWT 재발급 |

---

## API 명세

### 인증 API

#### POST /api/auth/signup
- 설명: 회원가입
- Request:
```json
{
  "email": "test@test.com",
  "password": "password123!",
  "nickname": "상우"
}
```
- Response: `ApiResponse.success("회원가입 성공")`

#### POST /api/auth/email/send
- 설명: 이메일 인증 코드 발송
- Request: `{ "email": "test@test.com" }`
- Response: `ApiResponse.success("인증 코드 발송 완료")`

#### POST /api/auth/email/verify
- 설명: 이메일 인증 코드 확인
- Request: `{ "email": "test@test.com", "code": "123456" }`
- Response: `ApiResponse.success("인증 완료")`

#### POST /api/auth/login
- 설명: 로그인
- Request: `{ "email": "test@test.com", "password": "password123!" }`
- Response:
```json
{
  "accessToken": "eyJ...",
  "tokenType": "Bearer"
}
```
- Refresh Token은 httpOnly Cookie로 설정

#### POST /api/auth/logout
- 설명: 로그아웃 (Redis Refresh Token 삭제)
- Header: `Authorization: Bearer {accessToken}`
- Response: `ApiResponse.success("로그아웃 완료")`

---

### 유저 API

#### GET /api/users/me
- 설명: 내 정보 조회
- Header: `Authorization: Bearer {accessToken}`
- Response:
```json
{
  "email": "test@test.com",
  "nickname": "상우"
}
```

#### PUT /api/users/me
- 설명: 내 정보 수정
- Request: `{ "nickname": "새닉네임", "password": "newPassword123!" }`
- Response: `ApiResponse.success("수정 완료")`

---

### 타로 API

#### GET /api/tarot/cards
- 설명: 타로 카드 전체 목록 조회 (78장)
- Response:
```json
[
  {
    "id": 1,
    "name": "The Fool",
    "arcanaType": "MAJOR",
    "imageUrl": "..."
  }
]
```

#### POST /api/tarot/reading
- 설명: AI 타로 상담 요청
- Header: `Authorization: Bearer {accessToken}`
- Request:
```json
{
  "concernText": "연애 문제로 고민 중입니다.",
  "cardIds": [1, 15, 32]
}
```
- Response:
```json
{
  "readingId": 1,
  "interpretation": "AI 해석 결과..."
}
```

---

### 상담 기록 API

#### GET /api/readings
- 설명: 내 상담 기록 목록 (최신순)
- Header: `Authorization: Bearer {accessToken}`
- Response:
```json
[
  {
    "id": 1,
    "concernText": "연애 문제...",
    "createdAt": "2025-05-19T10:00:00",
    "cards": ["The Fool", "The Lovers", "The Hermit"]
  }
]
```

#### GET /api/readings/{id}
- 설명: 상담 기록 상세 조회
- Response:
```json
{
  "id": 1,
  "concernText": "연애 문제...",
  "interpretation": "AI 해석 결과...",
  "cards": [...],
  "createdAt": "2025-05-19T10:00:00"
}
```

#### DELETE /api/readings/{id}
- 설명: 상담 기록 삭제 (본인 기록만)
- Response: `ApiResponse.success("삭제 완료")`

---

## 공통 응답 형식

```json
// 성공
{
  "success": true,
  "message": "성공 메시지",
  "data": { ... }
}

// 실패
{
  "success": false,
  "message": "에러 메시지",
  "data": null
}
```
