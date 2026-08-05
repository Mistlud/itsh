export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pages = getPageNumbers();
  const showFirstEllipsis = pages[0] > 2;
  const showLastEllipsis = pages[pages.length - 1] < totalPages - 1;

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        className="page-btn page-nav"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {pages[0] > 1 && (
        <button className="page-btn" onClick={() => onPageChange(1)}>1</button>
      )}
      {showFirstEllipsis && <span className="page-ellipsis">…</span>}

      {pages.map(p => (
        <button
          key={p}
          className={`page-btn ${p === page ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {showLastEllipsis && <span className="page-ellipsis">…</span>}
      {pages[pages.length - 1] < totalPages && (
        <button className="page-btn" onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </button>
      )}

      <button
        className="page-btn page-nav"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  );
}
