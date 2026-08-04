const BASE = 'https://api.manana.kr/karaoke';

async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('unexpected response');
  return data;
}

/** 공백 제거 — API가 URL 경로에 검색어를 그대로 사용하므로 띄어쓰기 미인식 문제 방지 */
function normalize(query) {
  return query.replace(/\s+/g, '');
}

/**
 * URL 경로용 인코딩
 * encodeURIComponent는 ! ' ( ) * ~ 를 인코딩하지 않아
 * 일부 서버에서 라우팅 오류가 발생하므로 추가 인코딩
 */
function encodeQuery(query) {
  return encodeURIComponent(normalize(query))
    .replace(/[!'()*~]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

export function fetchBySong(query) {
  return fetcher(`${BASE}/song/${encodeQuery(query)}.json`);
}

export function fetchBySinger(query) {
  return fetcher(`${BASE}/singer/${encodeQuery(query)}.json`);
}
