'use client';

interface Option {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: (Option | string)[];
  value: string;
  onChange: (v: string) => void;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export function SegmentedControl({ options, value, onChange, size = 'md', style }: SegmentedControlProps) {
  const opts = options.map(o => typeof o === 'string' ? { label: o, value: o } : o);
  const h = size === 'sm' ? 30 : 36;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 'var(--radius-md)', background: 'var(--stone-100)', padding: 3, gap: 2, ...style }}>
      {opts.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          height: h, padding: `0 ${size === 'sm' ? 12 : 16}px`, borderRadius: 'var(--radius-sm)', border: 'none',
          fontFamily: 'var(--font-sans)', fontSize: size === 'sm' ? 12.5 : 13.5, fontWeight: value === o.value ? 600 : 500,
          background: value === o.value ? 'var(--surface-card)' : 'transparent',
          color: value === o.value ? 'var(--text-strong)' : 'var(--text-muted)',
          boxShadow: value === o.value ? 'var(--shadow-sm)' : 'none',
          cursor: 'pointer', transition: 'all var(--dur-fast)', whiteSpace: 'nowrap',
        }}>{o.label}</button>
      ))}
    </div>
  );
}
