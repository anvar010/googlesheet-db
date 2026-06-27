'use client';

import { Icon } from './Icon';

interface FilterChipProps {
  label: string;
  active?: boolean;
  count?: number;
  dot?: string;
  onClick?: () => void;
  icon?: string;
  style?: React.CSSProperties;
}

export function FilterChip({ label, active, count, dot, onClick, icon, style }: FilterChipProps) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px',
      borderRadius: 'var(--radius-full)', border: active ? '1px solid var(--green-600)' : '1px solid var(--border-default)',
      background: active ? 'var(--green-600)' : 'var(--surface-card)', color: active ? 'var(--ivory)' : 'var(--text-body)',
      fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
      transition: 'all var(--dur-fast)', ...style,
    }}>
      {dot && <span style={{ width: 8, height: 8, borderRadius: '50%', background: active ? 'var(--ivory)' : dot }} />}
      {icon && <Icon name={icon} size={14} />}
      {label}
      {count !== undefined && <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.7 }}>{count}</span>}
    </button>
  );
}
