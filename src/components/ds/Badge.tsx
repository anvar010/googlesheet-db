'use client';

interface BadgeProps {
  tone?: string;
  soft?: boolean;
  dot?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const map: Record<string, [string, string]> = {
  neutral: ['var(--stone-700)', 'var(--stone-100)'],
  brand: ['var(--green-700)', 'var(--green-50)'],
  gold: ['var(--gold-700)', 'var(--gold-100)'],
  positive: ['var(--positive)', 'var(--positive-soft)'],
  negative: ['var(--negative)', 'var(--negative-soft)'],
  warning: ['var(--warning)', 'var(--warning-soft)'],
  info: ['var(--info)', 'var(--info-soft)'],
  palm: ['var(--gold-700)', 'var(--branch-palm-soft)'],
  difc: ['var(--green-700)', 'var(--branch-difc-soft)'],
  home: ['var(--info)', 'var(--branch-home-soft)'],
};

export function Badge({ tone = 'neutral', soft = true, dot, children, style, ...rest }: BadgeProps & React.HTMLAttributes<HTMLSpanElement>) {
  const [fg, bg] = map[tone] || map.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px',
      borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-sans)', fontSize: 12,
      fontWeight: 600, lineHeight: 1.4, color: fg,
      background: soft ? bg : 'transparent',
      border: soft ? 'none' : `1px solid ${fg}`,
      whiteSpace: 'nowrap', ...style,
    }} {...rest}>
      {dot && <span style={{ width: 7, height: 7, borderRadius: '50%', background: fg }} />}
      {children}
    </span>
  );
}
