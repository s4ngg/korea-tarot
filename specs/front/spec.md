# Frontend 스펙

## 기술 스택
- React (Vite)
- CSS Modules
- Zustand (전역 상태 관리)
- TanStack Query (서버 상태 관리)
- React Router v6

---

## 화면 목록 및 라우팅

| 경로 | 페이지명 | 설명 | 인증 필요 |
|------|----------|------|-----------|
| `/` | 메인 페이지 | 서비스 소개, 상담 시작 버튼 | X |
| `/signup` | 회원가입 | 이메일, 비밀번호, 닉네임 입력 | X |
| `/signup/verify` | 이메일 인증 | 인증 코드 입력 | X |
| `/login` | 로그인 | 이메일, 비밀번호 입력 | X |
| `/tarot` | 타로 상담 | 고민 입력 + 카드 선택 | O |
| `/tarot/result` | 상담 결과 | AI 해석 결과 출력 | O |
| `/mypage` | 마이페이지 | 내 정보 조회/수정 | O |
| `/mypage/readings` | 상담 기록 목록 | 상담 기록 최신순 목록 | O |
| `/mypage/readings/:id` | 상담 기록 상세 | 특정 상담 결과 상세 조회 | O |
| `*` | 에러 페이지 | 404 처리 | X |

---

## 컴포넌트 구조

```
src/
├── assets/                  # 이미지, 폰트
├── components/
│   ├── common/              # 공통 컴포넌트
│   │   ├── Header/
│   │   ├── Button/
│   │   ├── Input/
│   │   └── LoadingSpinner/
│   ├── tarot/               # 타로 관련 컴포넌트
│   │   ├── CardGrid/        # 카드 78장 그리드
│   │   ├── CardItem/        # 카드 단일 아이템
│   │   └── ReadingResult/   # 해석 결과 출력
│   └── mypage/              # 마이페이지 컴포넌트
│       └── ReadingList/
├── pages/                   # 라우팅 페이지
├── stores/                  # Zustand 전역 상태
│   └── authStore.js         # 로그인 상태, 유저 정보
├── hooks/                   # 커스텀 훅
├── api/                     # API 호출 함수
│   ├── authApi.js
│   ├── tarotApi.js
│   └── readingApi.js
├── styles/
│   └── global.css           # CSS 변수 (디자인 시스템)
└── App.jsx
```

---

## 전역 CSS 변수 (global.css)

```css
:root {
  --color-background: #131313;
  --color-primary: #0F051D;
  --color-accent: #C9A84C;
  --color-text: #e5e2e1;
  --color-surface: #201f1f;
  --color-surface-high: #2a2a2a;
  --color-error: #ffb4ab;

  --font-heading: 'Playfair Display', serif;
  --font-body: 'Manrope', sans-serif;

  --spacing-unit: 8px;
  --container-max: 1280px;
  --border-radius: 4px;
}
```

---

## 인증 처리

- Access Token: `localStorage` 저장
- Refresh Token: `httpOnly Cookie` 저장 (서버에서 설정)
- 인증 필요 페이지: `PrivateRoute` 컴포넌트로 감싸기
- 토큰 만료 시: Refresh Token으로 자동 재발급

---

## API 공통 설정 (axios)

```js
baseURL: http://localhost:8080
headers: {
  Authorization: Bearer {accessToken}
}
```
