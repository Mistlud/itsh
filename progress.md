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
- `npm run build` 성공 (dist/ 생성)
- GitHub 커밋·푸시 완료

### 구현된 기능
| 기능 | 파일 | 상태 |
|------|------|------|
| 곡명/가수명 탭 + 검색창 (debounce 1초) | SearchBar.jsx | ✅ |
| 브랜드 뱃지 결과 카드 | ResultList.jsx | ✅ |
| TJ만/금영만 토글 필터 | ControlBar.jsx | ✅ |
| 🇯🇵 TJ 일본곡 신곡 릴리즈 조회 | ControlBar.jsx, api.js | ✅ |
| 정렬 (최신/오래된/곡명/번호순) | ControlBar.jsx | ✅ |
| **번호 버튼 페이지네이션** (기본 20개씩) | Pagination.jsx | ✅ |
| **페이지당 건수 선택** (10/20/50/100) | ControlBar.jsx | ✅ |
| TJ 일본곡 번호 판별 함수 | utils/karaoke.js | ✅ |
| API 이중 인코딩 (공백 제거 / %20 유지) | utils/api.js | ✅ |
| 다크 테마 CSS (orb, glassmorphism) | index.css | ✅ |

---

## 3. API 호출 방식 (확정)

### 구조
모든 검색은 3개의 병렬 호출로 이루어짐:

```
1. fetchAll  — /karaoke/{type}/{query_stripped}.json
   공백 제거 인코딩. 모든 브랜드(TJ·금영·JOYSOUND·DAM·UGA) 반환.
   → JOYSOUND·DAM·UGA 수집 목적

2. fetchBrand('tj') — /karaoke/{type}/{query_spaced}.json?brand=tj
   공백 %20 인코딩. TJ 전용 인덱스 (일본곡 번호 대역 포함).

3. fetchBrand('kumyoung') — /karaoke/{type}/{query_spaced}.json?brand=kumyoung
   공백 %20 인코딩. 금영 전용 인덱스.
```

### 신곡 릴리즈 호출 (v2 API 연동 완료)
4. fetchTjJapaneseReleases — /v2/karaoke/release.json?release={YYYYMM}&brand=tj&limit=1000
   선택한 최근 개월 수만큼 병렬 호출하여 전체 릴리즈를 가져온 뒤, 일본곡 번호 대역 필터링 및 중복 제거 적용.

### 병합 규칙
- TJ·금영 결과: brand 전용 호출 결과로 완전 교체
- JOYSOUND·DAM·UGA: fetchAll 결과에서 유지
- 중복 제거 키: `brand + no`

### 공백 처리 이유
| 호출 | 인코딩 | 이유 |
|------|--------|------|
| 일반(fetchAll) | 공백 제거 | 브랜드 없는 엔드포인트는 공백 미인식 |
| ?brand=tj/kumyoung | 공백 %20 유지 | 브랜드 전용 인덱스는 %20 필요 |

---

## 4. 미결 사항

| 항목 | 상태 | 비고 |
|------|------|------|
| Vercel 배포 | ❌ 미완료 | GitHub itsh 레포 연결, Framework Preset: Vite |

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
    ├── App.jsx                 # 상태관리, debounce, useMemo 필터+정렬, 페이지네이션
    ├── main.jsx
    ├── index.css               # 다크 테마 전체 스타일
    ├── components/
    │   ├── SearchBar.jsx       # 히어로/컴팩트 모드 전환
    │   ├── ControlBar.jsx      # 결과 수 + 브랜드필터 + TJ일본곡 + 정렬 + 페이지크기
    │   ├── ResultList.jsx      # 결과 카드 + 로딩/에러/빈 상태
    │   └── Pagination.jsx      # 번호 버튼 페이지네이션
    └── utils/
        ├── api.js              # fetchBySong, fetchBySinger (3중 병렬 호출)
        └── karaoke.js          # isTjJapanese(no), BRAND_INFO
```

---

## 6. App.jsx 주요 상태

```js
const [query, setQuery]             // 검색어
const [searchType, setSearchType]   // 'song' | 'singer'
const [results, setResults]         // null(미검색) | 배열
const [loading, setLoading]
const [error, setError]
const [sort, setSort]               // 'latest'|'oldest'|'title'|'no'
const [isReleaseMode, setIsReleaseMode] // TJ 일본곡 릴리즈 모드
const [releaseMonths, setReleaseMonths] // 릴리즈 개월 수 (1/3/6)
const [brandFilter, setBrandFilter] // null | 'tj' | 'kumyoung'
const [page, setPage]               // 현재 페이지 (1-indexed)
const [pageSize, setPageSize]       // 페이지당 건수 (기본 20)
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
- 페이지네이션: 번호 버튼, accent 색상 활성 표시
- 720px 이하 모바일 반응형

---

## 9. 주의사항

- `App.css`는 Vite scaffold 기본 파일, import 없음 (삭제 가능)
- `isTjJapanese` 판별 구간은 2026-08-04 기준. TJ 번호 체계 변경 시 재검증 필요
- Manana API는 개인 운영 오픈 API — 공식 SLA 없음
- 가수명 검색 시 한글/영문 표기 혼재 가능 (아이유 / IU 별도 검색 필요)
