'use client';

interface LegendItem {
  label: string;
  color: string;
  value?: string | number;
}

interface LegendProps {
  items: LegendItem[];
  columns?: number;
  style?: React.CSSProperties;
}

export function Legend({ items, columns = 2, style }: LegendProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '8px 16px', ...style }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: it.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{it.label}</span>
          {it.value !== undefined && <span className="ds-num" style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text-strong)' }}>{it.value}</span>}
        </div>
      ))}
    </div>
  );
}
