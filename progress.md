# itsh 진행 상황 (progress)

> 새 세션에서는 이 파일만 읽으면 현재 상태와 다음 작업을 파악할 수 있다.  
> 마지막 업데이트: 2026-08-04 (v1.0 구현 완료, 빌드 성공, Vercel 배포 전)

---

## 1. 프로젝트 개요

- **서비스명**: 이 곡 노래방에 있어? (itsh)
- **목적**: 곡명/가수명 검색 → 금영·TJ 등 노래방 수록 여부 및 번호 확인
- **형태**: 1페이지 반응형 웹앱 (React 19 + Vite 8)
- **배포**: Vercel 예정 — https://itsh.vercel.app
- **작업 디렉토리**: `C:\ccy\itsh`
- **Git 원격**: `https://github.com/Mistlud/itsh.git` (브랜치 `main`)

참고 문서:
- `Plan.md` — 확정 기획서 (미결 사항 없음)

---

## 2. API 정보

- **데이터 소스**: Manana API (`https://api.manana.kr`)
- **인증**: 불필요 (무료, 호출 제한 없음, CORS 허용)
- **서버리스 함수**: 불필요 (클라이언트에서 직접 호출)
- **환경변수**: 없음

### 사용 엔드포인트

| 기능 | URL |
|------|-----|
| 곡명 검색 | `GET https://api.manana.kr/karaoke/song/{곡명}.json` |
| 가수명 검색 | `GET https://api.manana.kr/karaoke/singer/{가수명}.json` |

### 응답 구조

```json
[{ "brand": "tj", "no": "12345", "title": "곡명", "singer": "가수명", "composer": "...", "lyricist": "...", "release": "2026-08-04" }]
```

---

## 3. 파일 구조

```
C:\ccy\itsh\
├── .gitignore
├── index.html                  # HTML 진입점 (SEO 메타태그, Noto Sans KR 폰트)
├── package.json                # react 19, react-dom, vite 8
├── vite.config.js              # Vite React 플러그인
├── Plan.md                     # 확정 기획서
├── README.md                   # 프로젝트 설명
├── progress.md                 # 이 파일
└── src/
    ├── App.jsx                 # 메인 컴포넌트
    ├── main.jsx                # React 진입
    ├── index.css               # 전역 스타일 (다크 테마, 반응형)
    ├── components/
    │   ├── SearchBar.jsx       # 타이틀 + 탭 + 검색창 + 검색버튼
    │   ├── ControlBar.jsx      # 결과 수 표시 + 정렬 드롭다운 + TJ 일본곡 버튼
    │   └── ResultList.jsx      # 결과 카드 목록 + 로딩/에러/빈 상태
    └── utils/
        ├── api.js              # fetchBySong, fetchBySinger
        └── karaoke.js          # isTjJapanese(no), BRAND_INFO
```

### 핵심 파일 설계 포인트

**App.jsx** — 전체 상태 관리:
- `query`, `searchType`('song'|'singer'): 검색어 및 방식
- `results`(null=미검색 / 배열=검색완료): 원본 결과
- `loading`, `error`: 비동기 상태
- `sort`('latest'|'oldest'|'title'|'no'): 정렬 기준
- `tjJapanOnly`(boolean): TJ 일본곡 필터
- `displayed`: useMemo로 필터+정렬 적용한 최종 목록
- debounce: useRef 타이머로 1초 자동검색 구현

**SearchBar.jsx** — 두 가지 모드:
- 초기(hasSearched=false): 히어로 타이틀 + 큰 검색창
- 검색 후(hasSearched=true): compact 클래스 → 상단 바 형태로 전환

**ControlBar.jsx** — 결과 있을 때만 렌더:
- 결과 수 표시 (TJ 일본곡 필터 ON시 "N개 표시 중 / 전체 M개")
- TJ 일본곡 토글 버튼 (active 시 빨간색 강조)
- 정렬 드롭다운 (기본: 최신순)

**utils/karaoke.js** — `isTjJapanese(no)`:
```js
// TJ 일본곡 번호 대역 (Manana API 실데이터 검증 완료)
(n >= 6100  && n <= 6999)  ||
(n >= 25000 && n <= 29000) ||
(n >= 52565 && n <= 67999) ||
(n >= 68000 && n <= 68999)
```

**index.css** — 디자인:
- 다크 테마 (`#05050f` 배경)
- 배경 장식 orb (보라/핑크/파랑, blur 80px, 애니메이션)
- 히어로 타이틀: 그라디언트 텍스트 (흰→보라→핑크)
- 검색창: focus 시 보라색 glow
- 결과 카드: glassmorphism (rgba 배경 + border + blur)
- 브랜드 뱃지: 좌측 컬러 세로 막대 형태
- 720px 이하 모바일 반응형

---

## 4. 완료된 작업

- [x] 기획 수립 및 컨펌 (Plan.md 작성, 미결 사항 5개 전부 확정)
- [x] Manana API 조사 및 실데이터 검증
  - TJ 일본곡 번호 대역 4개 구간 검증 완료
  - `/karaoke/song/{query}.json`, `/karaoke/singer/{query}.json` 동작 확인
- [x] Git 초기화 및 GitHub 레포 연결 (`https://github.com/Mistlud/itsh.git`)
- [x] React + Vite 프로젝트 셋업 (`npx create-vite@latest --template react --overwrite`)
- [x] npm install (24 packages, 0 vulnerabilities)
- [x] 전체 소스 구현:
  - `src/utils/karaoke.js` — isTjJapanese, BRAND_INFO
  - `src/utils/api.js` — fetchBySong, fetchBySinger
  - `src/components/SearchBar.jsx` — 히어로/컴팩트 모드 전환
  - `src/components/ControlBar.jsx` — 정렬 + TJ 일본곡 버튼
  - `src/components/ResultList.jsx` — 카드 목록 + 상태 UI
  - `src/App.jsx` — 상태 관리, debounce, useMemo 필터+정렬
  - `src/index.css` — 다크 테마 전체 스타일
  - `index.html` — SEO 메타태그, Google Fonts
- [x] `npm run build` 성공 (21 modules, dist/ 생성)
- [x] Plan.md / README.md 최신화

---

## 5. 다음 작업

1. [ ] **Vercel 배포**
   - Vercel 프로젝트 생성 (GitHub itsh 레포 연결)
   - 환경변수 없음 → 별도 설정 불필요
   - Framework Preset: Vite 자동 감지
   - 배포 후 URL 확인: https://itsh.vercel.app

---

## 6. 기술 스택

- **프론트엔드**: React 19 + Vite 8 + Vanilla CSS
- **폰트**: Noto Sans KR (Google Fonts)
- **데이터**: Manana API (외부, 무료)
- **배포**: Vercel (환경변수 없음, 서버리스 없음)

---

## 7. 주의사항

- Manana API는 개인 운영 오픈 API — 공식 SLA 없음 (장기 안정성 고려 필요)
- `isTjJapanese` 판별 구간은 2026-08-04 기준 검증됨. TJ가 번호 체계를 변경하면 재검증 필요.
- `App.css`는 Vite scaffold 기본 파일로 사용하지 않음 (import 없음, 삭제 가능)
