# itsh 진행 상황 (progress)

> 새 세션에서는 이 파일을 먼저 읽어 현재 상태와 다음 작업을 파악할 것.
> 마지막 업데이트: 2026-08-05

---

## 1. 프로젝트 개요

- **서비스명**: 이 곡 노래방에 있어? (itsh)
- **목적**: 곡명/가수명 검색 → 금영·TJ 노래방 수록 여부 및 번호 확인
- **형태**: 1페이지 반응형 웹앱 (React 19 + Vite 8)
- **배포 예정**: https://itsh.vercel.app
- **작업 디렉토리**: `C:\ccy\itsh`
- **Git 원격**: `https://github.com/Mistlud/itsh.git` (브랜치 `main`)

---

## 2. 현재 구현 상태

### ✅ 완료된 것들
- React + Vite 프로젝트 셋업 및 전체 소스 구현
- `npm run build` 성공 (21 modules, dist/ 생성)
- GitHub 커밋·푸시 완료

### 구현된 기능
| 기능 | 파일 | 상태 |
|------|------|------|
| 곡명/가수명 탭 + 검색창 (debounce 1초) | SearchBar.jsx | ✅ |
| 브랜드 뱃지 결과 카드 | ResultList.jsx | ✅ |
| TJ만/금영만 토글 필터 | ControlBar.jsx | ✅ |
| 🇯🇵 TJ 일본곡 토글 필터 | ControlBar.jsx | ✅ |
| 정렬 (최신/오래된/곡명/번호순) | ControlBar.jsx | ✅ |
| TJ 일본곡 번호 판별 함수 | utils/karaoke.js | ✅ |
| 검색어 공백 제거 normalize() | utils/api.js | ✅ |
| 특수문자 URL 인코딩 | utils/api.js | ✅ |
| 다크 테마 CSS (orb, glassmorphism) | index.css | ✅ |

---

## 3. ❗ 최우선 미결 사항 — API 호출 방식 수정

### 문제 발견
지금까지 API를 **브랜드 파라미터 없이** 호출하고 있었음:
```
# 현재 (잘못된 방식)
https://api.manana.kr/karaoke/song/{query}.json
https://api.manana.kr/karaoke/singer/{query}.json
```
→ 모든 브랜드(TJ+금영+JOYSOUND+DAM+UGA) 결과를 받아 **클라이언트에서 brand 필드로 필터링**

### 증상
- BUMP OF CHICKEN TJ 검색 → 0건 (JOYSOUND/DAM/UGA는 나옴)
- Bad Romance (TJ 22046) 검색 → 0건
- TJ 일본 대역 곡 전체 검색 불가

### 원인
`?brand=tj` 없이 호출하면 **TJ 일본곡 번호 대역이 검색 인덱스에서 빠짐**.  
`?brand=tj`를 붙이면 TJ 전용 인덱스로 검색되어 일본곡도 포함됨.

### 사용자 실증 확인
```
https://api.manana.kr/karaoke/song/紅.json?brand=tj
→ TJ 일본곡 정상 검색됨 ✅
```

### 수정 방향
```
# 수정 후 (올바른 방식)
https://api.manana.kr/karaoke/song/{query}.json?brand=tj      ← TJ 전용
https://api.manana.kr/karaoke/song/{query}.json?brand=kumyoung ← 금영 전용
```
→ 두 호출을 **병렬(Promise.all)** 로 실행 후 결과 병합  
→ 클라이언트 필터링 제거 가능 (이미 브랜드별 분리됨)

### 수정해야 할 파일
**`src/utils/api.js`**:
```js
const BASE = 'https://api.manana.kr/karaoke';

function normalize(query) {
  return query.replace(/\s+/g, '');
}

function encodeQuery(query) {
  return encodeURIComponent(normalize(query))
    .replace(/[!'()*~]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

async function fetchBrand(type, query, brand) {
  const url = `${BASE}/${type}/${encodeQuery(query)}.json?brand=${brand}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// TJ + 금영 병렬 호출 후 병합
export async function fetchBySong(query) {
  const [tj, kumyoung] = await Promise.all([
    fetchBrand('song', query, 'tj'),
    fetchBrand('song', query, 'kumyoung'),
  ]);
  return [...tj, ...kumyoung];
}

export async function fetchBySinger(query) {
  const [tj, kumyoung] = await Promise.all([
    fetchBrand('singer', query, 'tj'),
    fetchBrand('singer', query, 'kumyoung'),
  ]);
  return [...tj, ...kumyoung];
}
```

---

## 4. 다음 작업 순서

1. **[ ] api.js 수정** — `?brand=tj` / `?brand=kumyoung` 병렬 호출로 변경
2. **[ ] 검색 테스트** — BUMP OF CHICKEN, Bad Romance, 일반 한국곡 등
3. **[ ] Vercel 배포** — GitHub itsh 레포 연결, Framework Preset Vite 자동 감지, 환경변수 없음

---

## 5. 파일 구조

```
C:\ccy\itsh\
├── .gitignore
├── index.html                  # SEO 메타태그, Noto Sans KR 폰트
├── package.json                # react 19, react-dom, vite 8
├── vite.config.js
├── Plan.md                     # 기획서
├── README.md
├── progress.md                 # 이 파일
└── src/
    ├── App.jsx                 # 상태관리, debounce, useMemo 필터+정렬
    ├── main.jsx
    ├── index.css               # 다크 테마 전체 스타일
    ├── components/
    │   ├── SearchBar.jsx       # 히어로/컴팩트 모드 전환
    │   ├── ControlBar.jsx      # 결과 수 + 브랜드필터 + TJ일본곡 + 정렬
    │   └── ResultList.jsx      # 결과 카드 + 로딩/에러/빈 상태
    └── utils/
        ├── api.js              # fetchBySong, fetchBySinger ← 수정 필요
        └── karaoke.js          # isTjJapanese(no), BRAND_INFO
```

---

## 6. App.jsx 주요 상태

```js
const [query, setQuery]           // 검색어
const [searchType, setSearchType] // 'song' | 'singer'
const [results, setResults]       // null(미검색) | 배열
const [loading, setLoading]
const [error, setError]
const [sort, setSort]             // 'latest'|'oldest'|'title'|'no'
const [tjJapanOnly, setTjJapanOnly]   // TJ 일본곡 필터
const [brandFilter, setBrandFilter]   // null | 'tj' | 'kumyoung'
```

---

## 7. TJ 일본곡 판별 (`isTjJapanese`)

```js
// 2026-08-04 Manana API 실데이터로 검증된 번호 대역
(n >= 6100  && n <= 6999)  ||
(n >= 25000 && n <= 29000) ||
(n >= 52565 && n <= 67999) ||
(n >= 68000 && n <= 68999)
```

---

## 8. 디자인 특징

- 배경 `#05050f`, orb 장식 (보라/핑크/파랑, blur 80px, float 애니메이션)
- 히어로 타이틀: 그라디언트 텍스트 (흰→보라→핑크)
- 검색창: focus 시 보라색 glow (`var(--accent)`)
- 결과 카드: glassmorphism (rgba 배경 + border)
- 브랜드 뱃지: 좌측 컬러 세로 막대
- 720px 이하 모바일 반응형

---

## 9. 주의사항

- `App.css`는 Vite scaffold 기본 파일, import 없음 (삭제 가능)
- `isTjJapanese` 판별 구간은 2026-08-04 기준. TJ 번호 체계 변경 시 재검증 필요
- Manana API는 개인 운영 오픈 API — 공식 SLA 없음
