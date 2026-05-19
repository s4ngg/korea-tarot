# Frontend 명세

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

## 2. 기능 요구사항

### 인증 (FR-FE-AUTH)

| ID | 요구사항 |
|----|----------|
| FR-FE-AUTH-01 | 사용자는 닉네임/이메일/비밀번호를 입력해 회원가입할 수 있어야 한다 |
| FR-FE-AUTH-02 | 회원가입 성공 시 이메일 인증 페이지로 이동해야 한다 |
| FR-FE-AUTH-03 | 사용자는 발송된 6자리 코드를 입력해 이메일 인증을 완료할 수 있어야 한다 |
| FR-FE-AUTH-04 | 사용자는 이메일/비밀번호로 로그인할 수 있어야 한다 |
| FR-FE-AUTH-05 | 로그인 성공 시 Access Token을 localStorage에 저장하고 이전 페이지로 돌아가야 한다 |
| FR-FE-AUTH-06 | 비인증 상태에서 보호된 페이지 접근 시 로그인 페이지로 리다이렉트해야 한다 |
| FR-FE-AUTH-07 | API 401 응답 시 자동으로 로그아웃 처리하고 로그인 페이지로 이동해야 한다 |
| FR-FE-AUTH-08 | 헤더에서 로그아웃할 수 있어야 한다 |

### 타로 상담 (FR-FE-TAROT)

| ID | 요구사항 |
|----|----------|
| FR-FE-TAROT-01 | 사용자는 고민 텍스트를 최대 500자까지 입력할 수 있어야 한다 |
| FR-FE-TAROT-02 | 사용자는 78장 카드 그리드에서 최대 3장을 선택할 수 있어야 한다 |
| FR-FE-TAROT-03 | 이미 3장이 선택된 상태에서 다른 카드는 비활성화되어야 한다 |
| FR-FE-TAROT-04 | 고민 입력 + 카드 3장 선택이 모두 충족될 때만 제출 버튼이 활성화되어야 한다 |
| FR-FE-TAROT-05 | 상담 요청 성공 시 결과 페이지로 이동하면서 reading 데이터를 전달해야 한다 |

### 상담 기록 (FR-FE-READING)

| ID | 요구사항 |
|----|----------|
| FR-FE-READING-01 | 사용자는 마이페이지에서 최근 상담 기록 3건을 볼 수 있어야 한다 |
| FR-FE-READING-02 | 사용자는 전체 상담 기록 목록을 조회할 수 있어야 한다 |
| FR-FE-READING-03 | 사용자는 특정 상담 기록의 카드와 해석 전문을 볼 수 있어야 한다 |
| FR-FE-READING-04 | 사용자는 confirm 확인 후 상담 기록을 삭제할 수 있어야 한다 |

### 마이페이지 (FR-FE-MYPAGE)

| ID | 요구사항 |
|----|----------|
| FR-FE-MYPAGE-01 | 사용자는 자신의 이메일과 닉네임을 확인할 수 있어야 한다 |
| FR-FE-MYPAGE-02 | 사용자는 인라인 편집으로 닉네임을 수정할 수 있어야 한다 |

---

## 3. 유저 스토리

| ID | 스토리 | 인수 조건 |
|----|--------|-----------|
| US-FE-01 | 방문자로서, 서비스 소개를 보고 상담을 시작하고 싶다 | 메인 페이지에 CTA 버튼이 있고 클릭 시 상담 페이지로 이동한다 |
| US-FE-02 | 비회원으로서, 회원가입 후 이메일 인증을 완료하고 싶다 | 인증코드 6자리 입력 후 인증 완료 시 로그인 페이지로 이동한다 |
| US-FE-03 | 회원으로서, 고민을 적고 카드 3장을 골라 해석을 받고 싶다 | 카드 3장 + 고민 입력 시 버튼 활성화, 제출 후 결과 페이지로 이동한다 |
| US-FE-04 | 회원으로서, 과거 상담 기록을 다시 보고 싶다 | 마이페이지에서 기록 목록 진입, 카드와 해석 내용을 볼 수 있다 |
| US-FE-05 | 회원으로서, 불필요한 기록을 삭제하고 싶다 | 삭제 버튼 클릭 → confirm 창 → 삭제 후 목록 갱신 |

---

## 4. 입력 유효성 검사 규칙

| 필드 | 규칙 | 버튼 활성화 조건 |
|------|------|----------------|
| 이메일 | `type=email` + `required` | HTML 기본 검증 |
| 비밀번호 (신규) | `minLength=8` | HTML 기본 검증 |
| 닉네임 | `required` | HTML 기본 검증 |
| 인증 코드 | 숫자만, 정확히 6자리 (`/\D/g` 제거) | length === 6 |
| 고민 입력 | `maxLength=500` | trim().length > 0 |
| 카드 선택 | 최대 3장 | selectedIds.length === 3 |
| 제출 버튼 (타로) | 고민 입력 AND 카드 3장 | 둘 다 충족 시 |

---

## 5. 라우팅

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

**PrivateRoute 동작**
```jsx
if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
return children;
```

---

## 6. 전역 상태 (Zustand)

### authStore (`src/stores/authStore.js`)

```js
{
  accessToken: string | null,      // localStorage 동기화
  user: { email, nickname } | null,
  isAuthenticated: boolean,        // !!accessToken

  setAuth(accessToken, user?),     // 로그인 성공 시
  clearAuth(),                     // 로그아웃 / 401 응답 시
  setUser(user),                   // 프로필 fetch 후
}
```

- `accessToken`: 로그인 시 `localStorage.setItem`, 새로고침 시 `localStorage.getItem`으로 복원
- `isAuthenticated = !!accessToken`

---

## 7. Axios 설정 (`axiosInstance.js`)

```js
baseURL: 'http://localhost:8080'
withCredentials: true              // Refresh Token Cookie 포함

// Request 인터셉터
headers.Authorization = `Bearer ${accessToken}`

// Response 인터셉터
// 401 → clearAuth() → navigate('/login')
```

---

## 8. API 함수 목록

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

## 9. TanStack Query 키

| queryKey | 용도 | staleTime |
|----------|------|-----------|
| `['my-profile']` | 내 정보 | 기본 |
| `['tarot-cards']` | 카드 목록 | Infinity 권장 |
| `['readings']` | 기록 목록 | 기본 |
| `['reading', id]` | 기록 상세 | 기본 |

---

## 10. 에러 처리 전략

| 상황 | 처리 방법 |
|------|-----------|
| API 401 응답 | axiosInstance 인터셉터 → `clearAuth()` + `/login` 리다이렉트 |
| API 에러 메시지 | `err.response?.data?.message` 추출 → 폼 내 `error` 상태로 표시 |
| TarotResultPage 직접 접근 | `location.state?.reading` 없으면 `/tarot` 리다이렉트 |
| 네트워크 오류 | TanStack Query `retry: 1`, 실패 시 에러 메시지 표시 |

---

## 11. 페이지 명세

### 11-1. MainPage (`/`)

**목적:** 서비스 소개 + 상담 시작 유도

**화면 구성**

| 구성요소 | 내용 |
|----------|------|
| Hero 섹션 | 서비스 제목, 부제목, "상담 시작하기" 버튼 |
| Features 섹션 | 3개 서비스 소개 카드 |
| Starfield 배경 | canvas 별빛 애니메이션 |

**인수 조건**
- "상담 시작하기" 클릭 → 비인증이면 `/login`, 인증이면 `/tarot`

---

### 11-2. LoginPage (`/login`)

**목적:** 이메일/비밀번호로 로그인

**화면 구성**

| 구성요소 | 내용 |
|----------|------|
| glassmorphism 카드 | 중앙 배치 |
| 이메일 필드 | type=email, autoComplete=email |
| 비밀번호 필드 | type=password, autoComplete=current-password |
| 로그인 버튼 | 금색 그라디언트, isPending 시 비활성화 |
| 에러 메시지 | API 에러 시 카드 내부 표시 |
| 회원가입 링크 | `/signup` 이동 |

**인수 조건**
- 로그인 성공 → `setAuth(accessToken)` → `location.state?.from?.pathname || '/'` 로 이동
- 로그인 실패 → 에러 메시지 표시, 폼 유지

---

### 11-3. SignupPage (`/signup`)

**목적:** 닉네임/이메일/비밀번호 입력 후 회원가입

**화면 구성**

| 구성요소 | 내용 |
|----------|------|
| 닉네임 필드 | type=text, required |
| 이메일 필드 | type=email, required |
| 비밀번호 필드 | type=password, minLength=8 |
| 가입 완료 버튼 | 금색 그라디언트 |
| 로그인 링크 | `/login` 이동 |

**인수 조건**
- 성공 → `navigate('/signup/verify', { state: { email } })`
- 이메일 중복 → 에러 메시지 표시

---

### 11-4. SignupVerifyPage (`/signup/verify`)

**목적:** 발송된 인증 코드 6자리 입력

**화면 구성**

| 구성요소 | 내용 |
|----------|------|
| 이메일 표시 | `location.state.email` |
| 코드 입력 | 숫자만, maxLength=6, inputMode=numeric |
| 인증 완료 버튼 | 6자리 미충족 시 비활성화 |
| 재시도 버튼 | `/signup` 복귀 |

**인수 조건**
- 6자리 미만이면 버튼 비활성화
- 인증 성공 → `navigate('/login')`
- 코드 오류/만료 → 에러 메시지 표시

---

### 11-5. TarotPage (`/tarot`)

**목적:** 고민 입력 + 카드 3장 선택 → 상담 요청

**화면 구성**

| 구성요소 | 내용 |
|----------|------|
| 고민 textarea | maxLength=500, 우측 하단 글자수 표시 |
| 카드 그리드 | `useQuery(['tarot-cards'])`, 6열 반응형 그리드 |
| 카드 | 선택 시 금색 테두리 + shimmer 애니메이션 |
| 선택 카운터 | `{n} / 3` 표시, 3장 완료 시 강조색 |
| 제출 버튼 | 고민 + 카드 3장 모두 충족 시 활성화 |

**인수 조건**
- 3장 이미 선택 시 나머지 카드 비활성화
- 고민 미입력 또는 카드 3장 미선택 → 버튼 비활성화
- 제출 성공 → `navigate('/tarot/result', { state: { reading: res.data.data } })`

---

### 11-6. TarotResultPage (`/tarot/result`)

**목적:** AI 해석 결과 표시

**화면 구성**

| 구성요소 | 내용 |
|----------|------|
| 카드 3장 섹션 | 과거/현재/미래 레이블, 현재(idx=1) 카드 강조 |
| 운명의 속삭임 | 스크롤 장식 UI, `interpretation` 텍스트 |
| 기록 보러가기 | `/mypage/readings` |
| 다시 상담하기 | `/tarot` |

**인수 조건**
- `location.state.reading` 없으면 `/tarot`으로 리다이렉트 (useEffect)
- 카드는 `cardOrder` 기준 정렬하여 표시

---

### 11-7. MyPage (`/mypage`)

**목적:** 내 정보 확인 + 최근 상담 기록 3개

**화면 구성**

| 구성요소 | 내용 |
|----------|------|
| 프로필 | 아바타 원형, 닉네임, 이메일 |
| 닉네임 수정 | 인라인 편집, `useMutation(updateMyProfile)` |
| 최근 기록 | `readings.slice(0, 3)`, 카드 미니 + 자세히 보기 |
| 전체 보기 | `/mypage/readings` |

**데이터:** `useQuery(['my-profile'])`, `useQuery(['readings'])`

---

### 11-8. ReadingListPage (`/mypage/readings`)

**목적:** 전체 상담 기록 목록

**화면 구성**

| 구성요소 | 내용 |
|----------|------|
| 뒤로가기 | `/mypage` |
| 기록 카드 | 날짜, 고민 텍스트, 카드 미니, 자세히 보기 / 삭제 |
| 빈 상태 | "첫 상담 시작하기" CTA |

**인수 조건**
- 삭제 → confirm 창 → 확인 시 `useMutation(deleteReading)` → queryKey `['readings']` invalidate
- 기록 없음 → 빈 상태 메시지 + CTA 표시

---

### 11-9. ReadingDetailPage (`/mypage/readings/:id`)

**목적:** 특정 상담 기록 상세

**화면 구성**

| 구성요소 | 내용 |
|----------|------|
| 뒤로가기 | `/mypage/readings` |
| 날짜 | 우측 상단 |
| 고민 | 이탤릭 인용 형태 |
| 카드 3장 | 과거/현재/미래, 카드명 |
| 운명의 속삭임 | `interpretation` 전문 |
| 새 상담하기 | `/tarot` |
| 기록 삭제 | confirm → 삭제 → `/mypage/readings` |

**데이터:** `useQuery(['reading', id])` → `getReadingDetail(id)`

---

## 12. CSS 설계 규칙

### 규칙

| 항목 | 규칙 |
|------|------|
| 스타일링 | 모든 스타일은 `.module.css` 파일로 컴포넌트와 1:1 관리 |
| Tailwind | 사용 금지 |
| 전역 유틸 | `global.css`에만 허용 (`.glass-card`, `.gold-btn`, `.celestial-divider`, `.fadeIn`) |
| 인라인 스타일 | 애니메이션 딜레이 등 동적 값에만 허용 |

### CSS 변수 (`global.css`)

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
background: rgba(15, 5, 29, 0.6);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(201, 168, 76, 0.2);
box-shadow: 0 0 40px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.05);
```

### 금색 그라디언트 버튼 패턴

```css
background: linear-gradient(135deg, #C9A84C 0%, #9E7D2E 100%);
color: #3d2e00;
font-weight: 700;
```

---

## 13. 공통 컴포넌트

### Header

| 상태 | 표시 항목 |
|------|-----------|
| 미인증 | 로고, 로그인 링크, 회원가입 버튼 |
| 인증됨 | 로고, 상담하기, 마이페이지, 로그아웃 버튼 |

- `position: fixed`, glassmorphism, `z-index: 100`
- 로그아웃: `logout()` → `clearAuth()` → `navigate('/')`

### Starfield

- `<canvas>` 기반, `position: fixed; z-index: 0; pointer-events: none`
- 150개 금색(`rgba(201, 168, 76, ...)`) 별, `requestAnimationFrame` opacity 반짝임 애니메이션
- 창 resize 시 canvas 크기 재초기화, 언마운트 시 `cancelAnimationFrame` 정리

---

## 14. 디렉토리 구조

```
frontend/src/
├── api/
│   ├── axiosInstance.js
│   ├── authApi.js
│   ├── tarotApi.js
│   └── readingApi.js
├── components/
│   ├── common/
│   │   ├── Header/          Header.jsx + Header.module.css
│   │   └── Starfield/       Starfield.jsx + Starfield.module.css
│   └── PrivateRoute.jsx
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
│   └── authStore.js
├── styles/
│   └── global.css
├── App.jsx
└── main.jsx
```
