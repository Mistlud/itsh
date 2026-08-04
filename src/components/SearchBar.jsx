export default function SearchBar({ query, setQuery, searchType, setSearchType, onSearch, hasSearched }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <header className={`search-header ${hasSearched ? 'compact' : ''}`}>
      {!hasSearched ? (
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="hero-mic">🎤</span>
            <span>이 곡 노래방에 있어?</span>
          </h1>
          <p className="hero-subtitle">금영 · TJ · DAM · JOYSOUND 수록곡을 한번에 검색하세요</p>
        </div>
      ) : (
        <a href="/" className="compact-logo">🎤 이 곡 노래방에 있어?</a>
      )}

      <div className="search-tabs">
        <button
          id="tab-song"
          className={`tab ${searchType === 'song' ? 'active' : ''}`}
          onClick={() => setSearchType('song')}
        >
          곡명
        </button>
        <button
          id="tab-singer"
          className={`tab ${searchType === 'singer' ? 'active' : ''}`}
          onClick={() => setSearchType('singer')}
        >
          가수명
        </button>
      </div>

      <div className="search-box">
        <span className="search-icon">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={searchType === 'song' ? '곡명을 입력하세요...' : '가수명을 입력하세요...'}
          className="search-input"
          autoFocus
          autoComplete="off"
        />
        <button id="search-btn" className="search-btn" onClick={onSearch}>검색</button>
      </div>
    </header>
  );
}
