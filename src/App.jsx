import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import ControlBar from './components/ControlBar';
import ResultList from './components/ResultList';
import Pagination from './components/Pagination';
import { fetchBySong, fetchBySinger, fetchTjJapaneseReleases } from './utils/api';

export default function App() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('song');
  const [results, setResults] = useState(null);
  const [releaseResults, setReleaseResults] = useState(null);
  const [isReleaseMode, setIsReleaseMode] = useState(false);
  const [releaseMonths, setReleaseMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('latest');
  const [brandFilter, setBrandFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const debounceRef = useRef(null);

  const hasSearched = isReleaseMode || results !== null || loading || error !== null;

  const loadReleases = useCallback(async (months) => {
    setLoading(true);
    setError(null);
    setReleaseResults(null);
    setPage(1);
    try {
      const data = await fetchTjJapaneseReleases(months);
      setReleaseResults(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const doSearch = useCallback(async (q, type) => {
    if (!q.trim()) return;
    setIsReleaseMode(false);
    setReleaseResults(null);
    setLoading(true);
    setError(null);
    setResults(null);
    setPage(1);
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

  // 릴리즈 모드 토글: 핸들러 내부에서 loadReleases 수동 중복 호출을 제거하고 useEffect로 일원화
  const handleToggleReleaseMode = useCallback(() => {
    if (!isReleaseMode) {
      setIsReleaseMode(true);
      clearTimeout(debounceRef.current);
    } else {
      setIsReleaseMode(false);
      setReleaseResults(null);
      if (query.trim()) {
        doSearch(query, searchType);
      }
    }
  }, [isReleaseMode, query, searchType, doSearch]);

  // isReleaseMode 또는 releaseMonths 변경 시 단 1회만 데이터 로드
  useEffect(() => {
    if (isReleaseMode) {
      loadReleases(releaseMonths);
    }
  }, [releaseMonths, isReleaseMode, loadReleases]);

  // 입력 1초 후 자동 검색 — 릴리즈 모드일 때는 자동 검색 무시
  useEffect(() => {
    if (!query.trim() || isReleaseMode) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(query, searchType);
    }, 1000);
    return () => clearTimeout(debounceRef.current);
  }, [query, searchType, isReleaseMode, doSearch]);

  const handleSearch = useCallback(() => {
    clearTimeout(debounceRef.current);
    doSearch(query, searchType);
  }, [query, searchType, doSearch]);

  const displayed = useMemo(() => {
    if (isReleaseMode) {
      return releaseResults ? [...releaseResults] : [];
    }

    if (!results) return [];
    let r = [...results];

    if (brandFilter === 'tj') r = r.filter(x => x.brand === 'tj');
    else if (brandFilter === 'kumyoung') r = r.filter(x => x.brand === 'kumyoung');

    switch (sort) {
      case 'latest': r.sort((a, b) => b.release.localeCompare(a.release)); break;
      case 'oldest': r.sort((a, b) => a.release.localeCompare(b.release)); break;
      case 'title':  r.sort((a, b) => a.title.localeCompare(b.title, 'ko')); break;
      case 'no':     r.sort((a, b) => parseInt(a.no, 10) - parseInt(b.no, 10)); break;
      default: break;
    }
    return r;
  }, [isReleaseMode, releaseResults, results, sort, brandFilter]);

  useEffect(() => {
    setPage(1);
  }, [displayed, pageSize]);

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize));
  const pagedItems = displayed.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="app">
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
              totalCount={isReleaseMode ? (releaseResults ? releaseResults.length : 0) : (results ? results.length : 0)}
              sort={sort}
              setSort={setSort}
              brandFilter={brandFilter}
              setBrandFilter={setBrandFilter}
              isReleaseMode={isReleaseMode}
              onToggleReleaseMode={handleToggleReleaseMode}
              releaseMonths={releaseMonths}
              setReleaseMonths={setReleaseMonths}
              pageSize={pageSize}
              setPageSize={setPageSize}
              loading={loading}
            />
            <ResultList
              results={pagedItems}
              loading={loading}
              error={error}
            />
            {!loading && !error && displayed.length > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
