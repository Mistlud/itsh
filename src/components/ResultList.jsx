import { BRAND_INFO } from '../utils/karaoke';

function Spinner() {
  return (
    <div className="state-container">
      <div className="spinner" aria-label="검색 중">
        <div className="spinner-ring" />
      </div>
      <p className="state-text">검색 중...</p>
    </div>
  );
}

function SongCard({ song, index }) {
  const brand = BRAND_INFO[song.brand] || { label: song.brand.toUpperCase(), color: '#888', glow: 'rgba(136,136,136,0.3)' };
  const releaseYear = song.release ? song.release.slice(0, 4) : '';
  const releaseDate = song.release && song.release !== '0000-00-00' ? song.release : '—';

  return (
    <li
      className="result-card"
      style={{ animationDelay: `${Math.min(index * 0.04, 0.6)}s` }}
    >
      <span
        className="brand-badge"
        style={{ background: brand.color, boxShadow: `0 0 12px ${brand.glow}` }}
      >
        {brand.label}
      </span>
      <div className="card-body">
        <div className="card-main">
          <span className="song-title">{song.title}</span>
          <span className="song-no">#{song.no}</span>
        </div>
        <div className="card-meta">
          <span className="song-singer">{song.singer}</span>
          <span className="song-release">{releaseDate}</span>
        </div>
      </div>
    </li>
  );
}

export default function ResultList({ results, loading, error }) {
  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="state-container">
        <div className="state-icon">⚠️</div>
        <p className="state-text error">일시적 오류입니다. 잠시 후 다시 시도해 주세요.</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="state-container">
        <div className="state-icon">🔍</div>
        <p className="state-text">해당 곡이 노래방에 없거나, 검색어를 확인해 주세요.</p>
      </div>
    );
  }

  return (
    <ul className="result-list" role="list">
      {results.map((song, i) => (
        <SongCard key={`${song.brand}-${song.no}`} song={song} index={i} />
      ))}
    </ul>
  );
}
