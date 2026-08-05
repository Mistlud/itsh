import { isTjJapanese } from './karaoke';

const BASE = 'https://api.manana.kr/karaoke';
const BASE_V2 = 'https://api.manana.kr/v2/karaoke';

function encodeQueryStripped(query) {
  return encodeURIComponent(query.replace(/\s+/g, ''))
    .replace(/[!'()*~]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

function encodeQuerySpaced(query) {
  return encodeURIComponent(query.trim())
    .replace(/[!'()*~]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

async function fetchAll(type, query) {
  const url = `${BASE}/${type}/${encodeQueryStripped(query)}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function fetchBrand(type, query, brand) {
  const url = `${BASE}/${type}/${encodeQuerySpaced(query)}.json?brand=${brand}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

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

function getRecentMonths(monthsCount) {
  const result = [];
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;

  for (let i = 0; i < monthsCount; i++) {
    const yyyy = year.toString();
    const mm = month.toString().padStart(2, '0');
    result.push(`${yyyy}${mm}`);
    month--;
    if (month === 0) {
      month = 12;
      year--;
    }
  }
  return result;
}

export async function fetchTjJapaneseReleases(monthsCount = 1) {
  const months = getRecentMonths(monthsCount);
  const fetches = months.map(async (yyyyMM) => {
    const url = `${BASE_V2}/release.json?release=${yyyyMM}&brand=tj&limit=1000`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data && Array.isArray(data.data) ? data.data : [];
  });

  const resultsByMonth = await Promise.all(fetches);
  const allReleases = resultsByMonth.flat();

  // v2 API JSON 응답에 포함된 brand 및 isTjJapanese 판별
  const jpOnly = allReleases.filter(item => isTjJapanese(item.no));

  const seen = new Set();
  const deduped = jpOnly.filter(item => {
    const key = `${item.brand || 'tj'}-${item.no}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  deduped.sort((a, b) => (b.release || '').localeCompare(a.release || ''));
  return deduped;
}
