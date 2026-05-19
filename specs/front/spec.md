# Frontend 스펙

## 1. 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | React | 19.x |
| 빌드 도구 | Vite | 6.x |
| 라우팅 | React Router DOM | v7 (v6 API 호환) |
| 전역 상태 | Zustand | v5 |
| 서버 상태 | TanStack Query | v5 |
| HTTP | Axios | - |
| 스타일 | CSS Modules | - |
| 폰트 | Google Fonts CDN | Playfair Display, Manrope |

---

## 2. 디렉토리 구조

```
frontend/src/
├── api/
│   ├── axiosInstance.js     # Axios 공통 설정 (baseURL, 인터셉터)
│   ├── authApi.js           # 인증 관련 API
│   ├── tarotApi.js          # 타로 카드/상담 API
│   └── readingApi.js        # 상담 기록 API
├── components/
│   ├── common/
│   │   ├── Header/          # 공통 헤더 (glassmorphism, fixed)
│   │   ├── Button/          # 공통 버튼 컴포넌트
│   │   ├── Input/           # 공통 인풋 컴포넌트
│   │   ├── LoadingSpinner/  # 로딩 스피너
│   │   └── Starfield/       # canvas 별빛 배경
│   └── PrivateRoute.jsx     # 인증 보호 라우트
├── pages/
│   ├── MainPage.jsx + .module.css
│   ├── LoginPage.jsx + .module.css
│   ├── SignupPage.jsx + .module.css
│   ├── SignupVerifyPage.jsx + .module.css
│   ├── TarotPage.jsx + .module.css
│   ├── TarotResultPage.jsx + .module.css
│   ├── MyPage.jsx + .module.css
│   ├── ReadingListPage.jsx + .module.css
│   ├── ReadingDetailPage.jsx + .module.css
│   └── NotFoundPage.jsx + .module.css
├── stores/
│   └── authStore.js         # Zustand 인증 스토어
├── styles/
│   └── global.css           # CSS 변수 + 전역 리셋
├── App.jsx                  # 라우터 설정
└── main.jsx                 # QueryClientProvider, 앱 진입점
```

---

## 3. 라우팅

| 경로 | 컴포넌트 | 인증 | 설명 |
|------|----------|------|------|
| `/` | MainPage | X | 서비스 소개, CTA |
| `/login` | LoginPage | X | 로그인 폼 |
| `/signup` | SignupPage | X | 회원가입 폼 |
| `/signup/verify` | SignupVerifyPage | X | 이메일 인증 코드 입력 |
| `/tarot` | TarotPage | O | 고민 입력 + 카드 3장 선택 |
| `/tarot/result` | TarotResultPage | O | AI 해석 결과 |
| `/mypage` | MyPage | O | 내 정보 + 최근 기록 |
| `/mypage/readings` | ReadingListPage | O | 전체 기록 목록 |
| `/mypage/readings/:id` | ReadingDetailPage | O | 기록 상세 |
| `*` | NotFoundPage | X | 404 |

**PrivateRoute 동작:**
```jsx
// 미인증 → /login 으로 리다이렉트, 원래 경로는 location.state.from 에 보존
if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
```

---

## 4. 전역 상태 (Zustand)

### authStore (`src/stores/authStore.js`)

```js
{
  accessToken: string | null,    // localStorage 동기화
  user: { email, nickname } | null,
  isAuthenticated: boolean,

  setAuth(accessToken, user?),   // 로그인 성공 시
  clearAuth(),                   // 로그아웃 시
  setUser(user),                 // 프로필 로드 후
}
```

- `accessToken`은 `localStorage.setItem('accessToken', ...)` 로 영속화
- 페이지 새로고침 시 `localStorage.getItem('accessToken')` 으로 복원
- `isAuthenticated = !!accessToken`

---

## 5. Axios 공통 설정 (`axiosInstance.js`)

```js
baseURL: 'http://localhost:8080'
withCredentials: true    // Refresh Token Cookie 포함

// Request 인터셉터
headers.Authorization = `Bearer ${accessToken}`   // authStore에서 읽기

// Response 인터셉터
// 401 → clearAuth() → navigate('/login')
```

---

## 6. API 함수 목록

### authApi.js

| 함수 | 메서드 | 경로 | 설명 |
|------|--------|------|------|
| `signup(data)` | POST | `/api/auth/signup` | 회원가입 |
| `sendEmailVerification(data)` | POST | `/api/auth/email/send` | 인증코드 발송 |
| `verifyEmail(data)` | POST | `/api/auth/email/verify` | 인증코드 확인 |
| `login(data)` | POST | `/api/auth/login` | 로그인 |
| `logout()` | POST | `/api/auth/logout` | 로그아웃 |
| `getMyProfile()` | GET | `/api/users/me` | 내 정보 |
| `updateMyProfile(data)` | PUT | `/api/users/me` | 정보 수정 |

### tarotApi.js

| 함수 | 메서드 | 경로 | 설명 |
|------|--------|------|------|
| `getCards()` | GET | `/api/tarot/cards` | 78장 목록 |
| `createReading(data)` | POST | `/api/tarot/reading` | 상담 요청 |

### readingApi.js

| 함수 | 메서드 | 경로 | 설명 |
|------|--------|------|------|
| `getReadings()` | GET | `/api/readings` | 기록 목록 |
| `getReadingDetail(id)` | GET | `/api/readings/:id` | 기록 상세 |
| `deleteReading(id)` | DELETE | `/api/readings/:id` | 기록 삭제 |

---

## 7. TanStack Query 키 규칙

| queryKey | 용도 |
|----------|------|
| `['my-profile']` | 내 정보 |
| `['tarot-cards']` | 카드 목록 (staleTime 무한 권장) |
| `['readings']` | 기록 목록 |
| `['reading', id]` | 기록 상세 |

---

## 8. 페이지 명세

### 8-1. MainPage (`/`)

**목적:** 서비스 소개 + 상담 시작 유도

| 구성요소 | 설명 |
|----------|------|
| Hero 섹션 | 서비스 제목, 부제목, "상담 시작하기" CTA 버튼 |
| Features 섹션 | 3개 서비스 카드 (오늘의 카드, 관계 스프레드, 출생 차트) |
| Starfield 배경 | canvas 별빛 애니메이션 |

---

### 8-2. LoginPage (`/login`)

**목적:** 이메일/비밀번호로 로그인

| 구성요소 | 설명 |
|----------|------|
| glassmorphism 카드 | 중앙 배치, `rgba(15,5,29,0.6)` + blur |
| 이메일 필드 | type=email, autoComplete=email |
| 비밀번호 필드 | type=password, autoComplete=current-password |
| 로그인 버튼 | 금색 그라디언트, isPending 시 비활성화 |
| 에러 메시지 | API 에러 시 카드 내 표시 |
| 회원가입 링크 | `/signup` 이동 |

**로그인 성공 후 처리:**
```
setAuth(accessToken)
→ navigate(location.state?.from?.pathname || '/')
```

---

### 8-3. SignupPage (`/signup`)

**목적:** 닉네임/이메일/비밀번호 입력 후 회원가입

| 구성요소 | 설명 |
|----------|------|
| 닉네임 필드 | type=text |
| 이메일 필드 | type=email |
| 비밀번호 필드 | type=password, minLength=8 |
| 가입 완료 버튼 | 금색 그라디언트 |
| 로그인 링크 | `/login` 이동 |

**성공 후:** `navigate('/signup/verify', { state: { email } })`

---

### 8-4. SignupVerifyPage (`/signup/verify`)

**목적:** 발송된 인증 코드 6자리 입력

| 구성요소 | 설명 |
|----------|------|
| 이메일 표시 | `location.state.email` |
| 코드 입력 | 숫자만, maxLength=6, inputMode=numeric |
| 인증 완료 버튼 | 6자리 미충족 시 비활성화 |
| 재시도 버튼 | `/signup` 복귀 |

**성공 후:** `navigate('/login', { state: { verified: true } })`

---

### 8-5. TarotPage (`/tarot`)

**목적:** 고민 입력 + 카드 3장 선택 → 상담 요청

| 구성요소 | 설명 |
|----------|------|
| 고민 입력 textarea | maxLength=500, 글자수 표시 |
| 카드 그리드 | `useQuery(['tarot-cards'])` 로 fetch, 10열 그리드 |
| 카드 선택 인터랙션 | 최대 3장, 선택 시 금색 테두리 + shimmer 애니메이션 |
| 선택 카운터 | `{선택수} / 3` 표시 |
| 해석 받기 버튼 | `고민 입력 + 카드 3장` 모두 충족 시만 활성화 |

**카드 선택 비활성화 조건:** 이미 3장 선택된 상태에서 미선택 카드 클릭 → disabled

**상담 요청 성공 후:**
```
navigate('/tarot/result', { state: { reading: res.data.data } })
```

---

### 8-6. TarotResultPage (`/tarot/result`)

**목적:** AI 해석 결과 표시

| 구성요소 | 설명 |
|----------|------|
| 카드 3장 | 과거/현재/미래 레이블, 현재 카드 강조 (금색 테두리) |
| 운명의 속삭임 섹션 | 스크롤 형태 장식 UI, `interpretation` 텍스트 |
| 기록 보러가기 | `/mypage/readings` 이동 |
| 다시 상담하기 | `/tarot` 이동 |

**데이터 소스:** `location.state.reading` (navigate로 전달)
**예외 처리:** state 없으면 `/tarot` 리다이렉트 (`useEffect` 내 처리)

---

### 8-7. MyPage (`/mypage`)

**목적:** 내 정보 + 최근 상담 기록 3개

| 구성요소 | 설명 |
|----------|------|
| 프로필 아바타 | 금색 테두리 원형 |
| 닉네임 + 이메일 | `useQuery(['my-profile'])` |
| 닉네임 수정 | 인라인 편집, `useMutation(updateMyProfile)` |
| 최근 기록 3개 | `readings.slice(0, 3)`, 카드 미니 + 자세히 보기 |
| 전체 보기 링크 | `/mypage/readings` |
| 인용구 섹션 | 신비로운 분위기 장식 요소 |

---

### 8-8. ReadingListPage (`/mypage/readings`)

**목적:** 전체 상담 기록 목록

| 구성요소 | 설명 |
|----------|------|
| 뒤로가기 | `/mypage` |
| 기록 카드 목록 | 날짜, 고민, 카드 미니, 자세히 보기/삭제 버튼 |
| 삭제 | `confirm` 확인 후 `useMutation(deleteReading)` |
| 빈 상태 | "첫 상담 시작하기" CTA 표시 |

---

### 8-9. ReadingDetailPage (`/mypage/readings/:id`)

**목적:** 특정 상담 기록 상세

| 구성요소 | 설명 |
|----------|------|
| 뒤로가기 | `/mypage/readings` |
| 날짜 | 우측 상단 표시 |
| 고민 텍스트 | 이탤릭체 인용 형태 |
| 카드 3장 | 과거/현재/미래, 카드 이름 |
| 운명의 속삭임 | `interpretation` 전문 |
| 새 상담하기 | `/tarot` |
| 기록 삭제 | confirm 후 삭제 → `/mypage/readings` |

**데이터:** `useQuery(['reading', id])` → `getReadingDetail(id)`

---

## 9. CSS 설계 규칙

### CSS 변수 (global.css)

```css
:root {
  --color-background: #131313;
  --color-primary: #0F051D;
  --color-accent: #C9A84C;
  --color-accent-bright: #e6c364;
  --color-text: #e5e2e1;
  --color-text-muted: #cbc4cd;
  --color-surface: #201f1f;
  --color-surface-high: #2a2a2a;
  --color-surface-lowest: #0e0e0e;
  --color-outline: #958f97;
  --color-error: #ffb4ab;
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Manrope', sans-serif;
  --spacing-unit: 8px;
  --container-max: 1280px;
  --border-radius: 4px;
}
```

### glassmorphism 패턴

```css
.glassCard {
  background: rgba(15, 5, 29, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(201, 168, 76, 0.2);
  box-shadow: 0 0 40px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.05);
}
```

### 금색 그라디언트 버튼 패턴

```css
.goldBtn {
  background: linear-gradient(135deg, #C9A84C 0%, #9E7D2E 100%);
  color: #3d2e00;
  font-weight: 700;
}
.goldBtn:hover {
  box-shadow: 0 0 20px rgba(201, 168, 76, 0.4);
  transform: translateY(-1px);
}
```

### 규칙

- Tailwind CSS 사용 금지
- 모든 스타일은 `.module.css` 파일로 컴포넌트와 1:1 관리
- 전역 유틸 클래스는 `global.css` 에만 허용 (`.glass-card`, `.gold-btn`, `.celestial-divider`)
- 인라인 스타일은 애니메이션 딜레이 등 동적 값에만 허용

---

## 10. 폼 유효성 검사 규칙

| 필드 | 규칙 |
|------|------|
| 이메일 | `type=email` + `required` |
| 비밀번호 (신규) | `minLength=8` |
| 닉네임 | `required` |
| 인증 코드 | 숫자만, 정확히 6자리 (`/\D/g` 제거) |
| 고민 입력 | `maxLength=500`, 1자 이상일 때 버튼 활성화 |
| 카드 선택 | 정확히 3장일 때 버튼 활성화 |

---

## 11. 에러 처리 전략

| 상황 | 처리 방법 |
|------|-----------|
| API 401 응답 | axiosInstance 인터셉터에서 `clearAuth()` + `/login` 리다이렉트 |
| API 에러 메시지 | `err.response?.data?.message` 추출 → 폼 내 `error` 상태로 표시 |
| TarotResultPage 직접 접근 | `location.state?.reading` 없으면 `/tarot` 리다이렉트 |
| 네트워크 오류 | TanStack Query `retry: 1` 설정, 실패 시 에러 메시지 |

---

## 12. Header 컴포넌트 동작

- `position: fixed` + glassmorphism (스크롤과 무관하게 상단 고정)
- `isAuthenticated === true` → 상담하기 / 마이페이지 / 로그아웃
- `isAuthenticated === false` → 로그인 / 회원가입(CTA 버튼)
- 로그아웃: `logout()` API → `clearAuth()` → `navigate('/')`
- 하위 페이지 모두 `padding-top: 64px~112px` (헤더 높이 보상)

---

## 13. Starfield 컴포넌트

- `<canvas>` 기반, `position: fixed; z-index: 0; pointer-events: none`
- 150개 금색(`rgba(201, 168, 76, ...)`) 별 점 무작위 생성
- `requestAnimationFrame` 루프로 opacity 반짝임 애니메이션
- 창 resize 시 canvas 크기 재초기화
- 페이지 언마운트 시 `cancelAnimationFrame` 정리
