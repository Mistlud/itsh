# itsh — 이 곡 노래방에 있어? | 기획서

> 최종 업데이트: 2026-08-05

---

## 1. 서비스 개요

- **목적**: 곡명 또는 가수명을 검색하면, 해당 곡이 금영·TJ 노래방에 수록되어 있는지 즉시 확인해주는 1페이지 반응형 웹앱
- **형태**: SPA (Single Page Application)
- **배포**: Vercel — https://itsh.vercel.app
- **데이터 소스**: Manana API (https://api.manana.kr)

---

## 2. 화면 구성

### 초기 화면 (미검색 상태)
- 히어로 타이틀: "이 곡 노래방에 있어?"
- 곡명 / 가수명 탭 선택
- 검색창 (입력 1초 후 자동검색 + 엔터/버튼 즉시검색)

### 검색 후 화면
- 검색창이 상단 컴팩트 바로 전환
- 컨트롤바: 결과 수 | [TJ만] [금영만] | [🇯🇵 TJ 일본곡] | [정렬▼]
- 결과 카드 목록

---

## 3. 결과 카드 표시 항목

| 항목 | 설명 |
|------|------|
| 브랜드 뱃지 | TJ (빨강) / 금영 (파랑) |
| 곡번호 | |
| 곡명 | |
| 가수명 | |
| 출시일 | |
| 국가 | 🇯🇵 TJ 일본곡 판별 시 표시 |

---

## 4. 필터 및 정렬

### 브랜드 필터 (토글 버튼)
- **TJ만**: TJ 브랜드만 표시 (활성 시 🔴)
- **금영만**: 금영 브랜드만 표시 (활성 시 🔵)
- 재클릭 시 해제 (전체로 복귀), 상호 배타적

### TJ 일본곡 필터
- TJ 일본곡 번호 대역에 해당하는 곡만 표시
- 브랜드 필터 위에 추가 적용 가능
- 판별 기준 (번호 대역, 2026-08-04 검증):
  - 6100 ~ 6999
  - 25000 ~ 29000
  - 52565 ~ 67999
  - 68000 ~ 68999

### 정렬
- 최신순 (기본) / 오래된 순 / 곡명순 / 번호순

---

## 5. API 사용 방식 (확정 수정 사항 포함)

### 기존 방식 (잘못됨)
```
GET https://api.manana.kr/karaoke/song/{query}.json
GET https://api.manana.kr/karaoke/singer/{query}.json
```
→ 모든 브랜드(TJ+금영+JOYSOUND+DAM+UGA)를 한 번에 받아 클라이언트에서 필터링  
→ **문제**: TJ 일본곡(BUMP OF CHICKEN, Bad Romance 등)이 미인덱스 구간에 속해 검색 불가

### 수정 방향 (미구현)
```
GET https://api.manana.kr/karaoke/song/{query}.json?brand=tj      ← TJ 전용 (일본곡 포함)
GET https://api.manana.kr/karaoke/song/{query}.json?brand=kumyoung ← 금영 전용
```
→ 두 호출을 병렬로 실행 후 결과 병합  
→ `?brand=tj` 파라미터를 사용하면 TJ의 일본곡도 검색됨 (사용자 실증 확인)  
→ **이 수정이 다음 세션의 최우선 작업**

### 공통 규칙
- 검색어 공백 제거: `"Bad Romance"` → `"BadRomance"` (API가 다중어 공백을 미지원)
- 특수문자 인코딩: `!` `'` `(` `)` `*` `~` → `%21` 등 추가 인코딩

---

## 6. TJ 일본곡 판별 로직 (`isTjJapanese`)

```js
// src/utils/karaoke.js
function isTjJapanese(no) {
  const n = parseInt(no, 10);
  return (
    (n >= 6100  && n <= 6999)  ||
    (n >= 25000 && n <= 29000) ||
    (n >= 52565 && n <= 67999) ||
    (n >= 68000 && n <= 68999)
  );
}
```

---

## 7. 기술 스택

- **프레임워크**: React 19 + Vite 8
- **스타일**: Vanilla CSS (다크 테마, glassmorphism, orb 배경 애니메이션)
- **폰트**: Noto Sans KR (Google Fonts)
- **데이터**: Manana API (무료, 인증 불필요, CORS 허용)
- **배포**: Vercel

---

## 8. 미결 사항

| 항목 | 상태 | 비고 |
|------|------|------|
| `?brand=tj` 파라미터 적용 | ❌ 미구현 | 최우선. api.js 수정 필요 |
| Vercel 배포 | ❌ 미완료 | api.js 수정 후 진행 |
