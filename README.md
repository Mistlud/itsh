# 이 곡 노래방에 있어? (itsh)

> 곡명 또는 가수명으로 검색하면, 해당 곡이 금영·TJ 등 노래방 기기에 수록되어 있는지 즉시 확인해주는 1페이지 반응형 웹앱.

**프로덕션**: https://itsh.vercel.app _(배포 예정)_

---

## 소개

노래방에 가기 전, 또는 노래방에서 기기를 찾기 귀찮을 때 — 곡명이나 가수명만 입력하면 해당 곡이 금영·TJ 등 어느 노래방 기기에 몇 번으로 수록되어 있는지 바로 확인할 수 있습니다.

- 곡명 / 가수명 탭 전환 검색
- 입력 1초 후 자동 검색 + 검색 버튼
- 브랜드별 색상 뱃지 (금영 / TJ / DAM / JOYSOUND / UGA)
- **TJ 일본곡만 보기** 토글 버튼 (번호 대역 기준 판별)
- 정렬: 최신순 · 오래된 순 · 곡명순 · 번호순 (드롭다운)
- 데스크톱 · 모바일 반응형 레이아웃 (720px 기준)

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React 19 + Vite 8 + Vanilla CSS |
| 데이터 | Manana API (`https://api.manana.kr`) — 무료, 인증 불필요 |
| 배포 | Vercel |

> 서버리스 함수 없음 — Manana API를 클라이언트에서 직접 호출합니다.

## 로컬 실행

```powershell
npm install
npm run dev
# → http://localhost:5173
```

## 빌드

```powershell
npm run build    # dist/ 생성
npm run preview  # 빌드 결과 로컬 확인
```

## 프로젝트 구조

```
itsh/
├── src/
│   ├── App.jsx                 # 메인 (검색·정렬·필터 상태 관리)
│   ├── index.css               # 전역 스타일 + 반응형
│   ├── components/
│   │   ├── SearchBar.jsx       # 타이틀 + 탭 + 검색창
│   │   ├── ControlBar.jsx      # 정렬 드롭다운 + TJ 일본곡 버튼
│   │   └── ResultList.jsx      # 결과 카드 목록
│   └── utils/
│       ├── api.js              # fetchBySong / fetchBySinger
│       └── karaoke.js          # isTjJapanese(no) + BRAND_INFO
├── Plan.md
├── progress.md
└── README.md
```

## TJ 일본곡 판별 구간

TJ 노래방 곡 번호 중 아래 대역은 일본곡으로 판별합니다 (Manana API 실데이터 검증 완료):

| 구간 | 비고 |
|------|------|
| 6100 ~ 6999 | 일본곡 |
| 25000 ~ 29000 | 일본곡 |
| 52565 ~ 67999 | 일본곡 |
| 68000 ~ 68999 | 일본곡 |

## 버전

- **v1.0.0** — 기획 확정, 전체 구현 완료 (빌드 성공), Vercel 배포 예정

## 라이선스

비공개 프로젝트.
