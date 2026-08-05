export default function ControlBar({
  count, totalCount, sort, setSort,
  tjJapanOnly, setTjJapanOnly,
  brandFilter, setBrandFilter,
  pageSize, setPageSize,
  loading,
}) {
  // 브랜드 토글: 이미 선택된 버튼 클릭 시 해제
  const toggleBrand = (brand) => {
    setBrandFilter(prev => prev === brand ? null : brand);
  };

  const isFiltered = brandFilter !== null || tjJapanOnly;

  return (
    <div className="control-bar">
      <span className="result-count">
        {loading
          ? '검색 중...'
          : isFiltered && totalCount !== count
            ? `${count}개 표시 중 (전체 ${totalCount}개)`
            : `${count}개`}
      </span>
      <div className="controls">
        {/* 브랜드 필터 */}
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

        {/* TJ 일본곡 필터 */}
        <button
          id="tj-japan-btn"
          className={`tj-japan-btn ${tjJapanOnly ? 'active' : ''}`}
          onClick={() => setTjJapanOnly(v => !v)}
          title="TJ 일본곡만 표시"
          disabled={loading}
        >
          🇯🇵 TJ 일본곡
        </button>

        {/* 정렬 */}
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

        {/* 페이지 크기 */}
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
