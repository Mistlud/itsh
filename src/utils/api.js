const BASE = 'https://api.manana.kr/karaoke';

/**
 * 일반 API용 인코딩 — 공백 제거
 * 브랜드 파라미터 없는 엔드포인트는 공백을 인식하지 못함
 */
function encodeQueryStripped(query) {
  return encodeURIComponent(query.replace(/\s+/g, ''))
    .replace(/[!'()*~]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

/**
 * 브랜드 전용 API용 인코딩 — 공백 %20 유지
 * ?brand=tj 등 브랜드 파라미터 사용 시 공백을 %20으로 인코딩해야 검색됨
 */
function encodeQuerySpaced(query) {
  return encodeURIComponent(query.trim())
    .replace(/[!'()*~]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

/** 브랜드 파라미터 없는 일반 호출 — 모든 브랜드 반환 */
async function fetchAll(type, query) {
  const url = `${BASE}/${type}/${encodeQueryStripped(query)}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/** 브랜드 전용 호출 — ?brand= 파라미터 사용, 공백 %20 유지 */
async function fetchBrand(type, query, brand) {
  const url = `${BASE}/${type}/${encodeQuerySpaced(query)}.json?brand=${brand}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/**
 * 일반 호출(전체 브랜드) + ?brand=tj + ?brand=kumyoung 병렬 실행 후 병합
 * - TJ·금영 결과는 brand 전용 호출(공백 %20)로 교체 → TJ 일본곡 + 금영 공백 포함 곡 포함
 * - JOYSOUND·DAM·UGA 등 기타 브랜드는 일반 호출 결과 유지
 * - brand + no 기준 중복 제거
 */
async function mergeResults(type, query) {
  const [all, tjFull, kumyoungFull] = await Promise.all([
    fetchAll(type, query),
    fetchBrand(type, query, 'tj'),
    fetchBrand(type, query, 'kumyoung'),
  ]);
  const others = all.filter(item => item.brand !== 'tj' && item.brand !== 'kumyoung');
  const seen = new Set();
  return [...tjFull, ...kumyoungFull, ...others].filter(item => {
    const key = `${item.brand}-${item.no}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function fetchBySong(query) {
  return mergeResults('song', query);
}

export function fetchBySinger(query) {
  return mergeResults('singer', query);
}
