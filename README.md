# 이 곡 노래방에 있어? (itsh)

> 곡명 또는 가수명으로 검색하면, 해당 곡이 금영·TJ 등 노래방 기기에 수록되어 있는지 즉시 확인해주는 1페이지 반응형 웹앱.

**프로덕션**: https://itsh.vercel.app _(배포 예정)_

---

## 소개

노래방에 가기 전, 또는 노래방에서 기기를 찾기 귀찮을 때 — 곡명이나 가수명만 입력하면 해당 곡이 금영·TJ 등 어느 노래방 기기에 몇 번으로 수록되어 있는지 바로 알 수 있습니다.

- 곡명 / 가수명 검색
- 브랜드별 필터 (금영 / TJ / 기타)
- 다양한 정렬 기준 (최신순 · 오래된 순 · 곡명순 · 번호순)
- 브랜드별 색상 뱃지로 한눈에 구분
- 입력 1초 후 자동 검색
- 데스크톱·모바일 반응형 레이아웃

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React 19 + Vite + Vanilla CSS |
| 데이터 | Manana API (`https://api.manana.kr`) |
| 배포 | Vercel |

## 로컬 실행

```powershell
npm install
npm run dev
# → http://localhost:5173
```

## 프로젝트 구조

```
itsh/
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── SearchBar.jsx
│   │   ├── FilterBar.jsx
│   │   └── ResultList.jsx
│   └── utils/
│       └── api.js
├── Plan.md
└── progress.md
```

## 라이선스

비공개 프로젝트.
