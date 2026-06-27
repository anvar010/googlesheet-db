'use client';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  track?: string;
  height?: number;
  style?: React.CSSProperties;
}

export function ProgressBar({ value, max = 100, color = 'var(--green-500)', track = 'var(--stone-100)', height = 8, style }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ height, borderRadius: height, background: track, overflow: 'hidden', ...style }}>
      <div style={{ height: '100%', width: `${pct}%`, borderRadius: height, background: color, transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)' }} />
    </div>
  );
}
