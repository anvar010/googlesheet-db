'use client';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  pad?: number;
  raised?: boolean;
  inverse?: boolean;
}

export function Card({ pad = 24, raised, inverse, children, style, ...rest }: CardProps) {
  return (
    <div style={{
      background: inverse ? 'var(--surface-inverse)' : 'var(--surface-card)',
      color: inverse ? 'var(--text-on-dark)' : 'var(--text-body)',
      border: inverse ? '1px solid var(--border-on-dark)' : '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', boxShadow: raised ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      padding: pad, ...style,
    }} {...rest}>{children}</div>
  );
}
