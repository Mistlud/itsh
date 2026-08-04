import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import ControlBar from './components/ControlBar';
import ResultList from './components/ResultList';
import { fetchBySong, fetchBySinger } from './utils/api';
import { isTjJapanese } from './utils/karaoke';

export default function App() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('song');
  const [results, setResults] = useState(null); // null = 미검색 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('latest');
  const [tjJapanOnly, setTjJapanOnly] = useState(false);
  const debounceRef = useRef(null);

  const hasSearched = results !== null || loading || error !== null;

  const doSearch = useCallback(async (q, type) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = type === 'song'
        ? await fetchBySong(q)
        : await fetchBySinger(q);
      setResults(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 입력 1초 후 자동 검색
  useEffect(() => {
    if (!query.trim()) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(query, searchType);
    }, 1000);
    return () => clearTimeout(debounceRef.current);
  }, [query, searchType, doSearch]);

  const handleSearch = useCallback(() => {
    clearTimeout(debounceRef.current);
    doSearch(query, searchType);
  }, [query, searchType, doSearch]);

  // 필터 + 정렬 적용
  const displayed = useMemo(() => {
    if (!results) return [];
    let r = [...results];

    if (tjJapanOnly) {
      r = r.filter(x => x.brand === 'tj' && isTjJapanese(x.no));
    }

    switch (sort) {
      case 'latest': r.sort((a, b) => b.release.localeCompare(a.release)); break;
      case 'oldest': r.sort((a, b) => a.release.localeCompare(b.release)); break;
      case 'title':  r.sort((a, b) => a.title.localeCompare(b.title, 'ko')); break;
      case 'no':     r.sort((a, b) => parseInt(a.no, 10) - parseInt(b.no, 10)); break;
      default: break;
    }
    return r;
  }, [results, sort, tjJapanOnly]);

  return (
    <div className="app">
      {/* 배경 장식 구 */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className={`main-container${hasSearched ? ' has-results' : ''}`}>
        <SearchBar
          query={query}
          setQuery={setQuery}
          searchType={searchType}
          setSearchType={setSearchType}
          onSearch={handleSearch}
          hasSearched={hasSearched}
        />

        {hasSearched && (
          <>
            <ControlBar
              count={displayed.length}
              totalCount={results ? results.length : 0}
              sort={sort}
              setSort={setSort}
              tjJapanOnly={tjJapanOnly}
              setTjJapanOnly={setTjJapanOnly}
              loading={loading}
            />
            <ResultList
              results={displayed}
              loading={loading}
              error={error}
            />
          </>
        )}
      </div>
    </div>
  );
}
