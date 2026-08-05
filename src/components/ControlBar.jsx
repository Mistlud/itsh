export default function ControlBar({
  count, totalCount, sort, setSort,
  brandFilter, setBrandFilter,
  isReleaseMode, onToggleReleaseMode,
  releaseMonths, setReleaseMonths,
  pageSize, setPageSize,
  loading,
}) {
  const toggleBrand = (brand) => {
    setBrandFilter(prev => prev === brand ? null : brand);
  };

  const isFiltered = brandFilter !== null;

  return (
    <div className="control-bar">
      <span className="result-count">
        {loading
          ? '불러오는 중...'
          : isReleaseMode
            ? `🇯🇵 TJ 신곡 ${count}개 (최근 ${releaseMonths}개월)`
            : isFiltered && totalCount !== count
              ? `${count}개 표시 중 (전체 ${totalCount}개)`
              : `${count}개`}
      </span>
      <div className="controls">
        {!isReleaseMode && (
          <div className="brand-filters">
            <button
              id="filter-tj"
              className={`brand-filter-btn tj ${brandFilter === 'tj' ? 'active' : ''}`}
              onClick={() => toggleBrand('tj')}
              disabled={loading}
            >
              TJ만
            </button>
            <button
              id="filter-kumyoung"
              className={`brand-filter-btn kumyoung ${brandFilter === 'kumyoung' ? 'active' : ''}`}
              onClick={() => toggleBrand('kumyoung')}
              disabled={loading}
            >
              금영만
            </button>
          </div>
        )}

        <button
          id="tj-japan-btn"
          className={`tj-japan-btn ${isReleaseMode ? 'active' : ''}`}
          onClick={onToggleReleaseMode}
          title="TJ 일본곡 신곡 릴리즈 목록 표시"
          disabled={loading}
        >
          🇯🇵 TJ 일본곡 신곡
        </button>

        {isReleaseMode ? (
          <select
            id="release-months-select"
            className="sort-select"
            value={releaseMonths}
            onChange={e => setReleaseMonths(Number(e.target.value))}
            disabled={loading}
          >
            <option value={1}>최근 1개월</option>
            <option value={3}>최근 3개월</option>
            <option value={6}>최근 6개월</option>
          </select>
        ) : (
          <select
            id="sort-select"
            className="sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
            disabled={loading}
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된 순</option>
            <option value="title">곡명순</option>
            <option value="no">번호순</option>
          </select>
        )}

        <select
          id="page-size-select"
          className="sort-select"
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          disabled={loading}
        >
          <option value={10}>10개씩</option>
          <option value={20}>20개씩</option>
          <option value={50}>50개씩</option>
          <option value={100}>100개씩</option>
        </select>
      </div>
    </div>
  );
}
