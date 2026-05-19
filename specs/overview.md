# AI Tarot Insight - 서비스 전체 개요

## 서비스 소개
사용자가 고민을 입력하고 타로 카드 3장을 선택하면,
RAG 기반 AI가 카드 의미와 고민을 결합해 개인 맞춤형 해석 결과를 제공하는 웹 서비스

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React (Vite), CSS Modules |
| Backend | Spring Boot, Java 21, JPA, MySQL, Redis |
| AI Server | FastAPI, OpenAI GPT, FAISS |
| 인증 | JWT (Access Token + Refresh Token) |
| 암호화 | BCrypt |

---

## 시스템 아키텍처

```
[ React (Vite) ]
       ↓ HTTP
[ Spring Boot :8080 ]
       ↓           ↓
  [ MySQL ]    [ Redis ]
       ↓
[ FastAPI :8000 ]
       ↓
[ OpenAI GPT + FAISS ]
```

---

## 주요 기능 요약

1. 회원가입 / 이메일 인증 / 로그인 / 로그아웃
2. 고민 입력 + 타로 카드 3장 선택
3. AI RAG 기반 타로 해석 결과 생성
4. 상담 기록 저장 / 조회 / 삭제

---

## 디자인 시스템

| 항목 | 값 |
|------|----|
| Background | #131313 |
| Primary | #0F051D |
| Accent (Gold) | #C9A84C |
| Text | #e5e2e1 |
| 헤딩 폰트 | Playfair Display |
| 본문 폰트 | Manrope |
| 기본 간격 단위 | 8px |
| 컨테이너 최대폭 | 1280px |
