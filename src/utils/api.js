const BASE = 'https://api.manana.kr/karaoke';

async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('unexpected response');
  return data;
}

export function fetchBySong(query) {
  return fetcher(`${BASE}/song/${encodeURIComponent(query)}.json`);
}

export function fetchBySinger(query) {
  return fetcher(`${BASE}/singer/${encodeURIComponent(query)}.json`);
}
