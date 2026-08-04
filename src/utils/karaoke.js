/**
 * TJ 일본곡 번호 판별
 * 대역: 6100~6999 / 25000~29000 / 52565~67999 / 68000~68999
 */
export function isTjJapanese(no) {
  const n = parseInt(no, 10);
  if (isNaN(n)) return false;
  return (
    (n >= 6100 && n <= 6999) ||
    (n >= 25000 && n <= 29000) ||
    (n >= 52565 && n <= 67999) ||
    (n >= 68000 && n <= 68999)
  );
}

export const BRAND_INFO = {
  kumyoung: { label: '금영',     color: '#3b82f6', glow: 'rgba(59,130,246,0.35)' },
  tj:       { label: 'TJ',      color: '#ef4444', glow: 'rgba(239,68,68,0.35)'  },
  dam:      { label: 'DAM',     color: '#22c55e', glow: 'rgba(34,197,94,0.35)'  },
  joysound: { label: 'JOYSOUND',color: '#f59e0b', glow: 'rgba(245,158,11,0.35)' },
  uga:      { label: 'UGA',     color: '#8b5cf6', glow: 'rgba(139,92,246,0.35)' },
};
