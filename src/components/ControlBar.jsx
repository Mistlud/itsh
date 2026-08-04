export default function ControlBar({ count, totalCount, sort, setSort, tjJapanOnly, setTjJapanOnly, loading }) {
  return (
    <div className="control-bar">
      <span className="result-count">
        {loading
          ? '검색 중...'
          : tjJapanOnly && totalCount !== count
            ? `${count}개 표시 중 (전체 ${totalCount}개)`
            : `${count}개`}
      </span>
      <div className="controls">
        <button
          id="tj-japan-btn"
          className={`tj-japan-btn ${tjJapanOnly ? 'active' : ''}`}
          onClick={() => setTjJapanOnly(v => !v)}
          title="TJ 일본곡만 표시"
        >
          🇯🇵 TJ 일본곡
        </button>
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
      </div>
    </div>
  );
}
