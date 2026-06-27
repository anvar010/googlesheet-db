'use client';

import { Icon } from './Icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconRight?: string;
  full?: boolean;
}

const sizes = { sm: { padding: '0 12px', height: 34, fontSize: 13, radius: 'var(--radius-sm)' }, md: { padding: '0 18px', height: 42, fontSize: 14, radius: 'var(--radius-md)' }, lg: { padding: '0 26px', height: 50, fontSize: 15, radius: 'var(--radius-md)' } };
const variants = {
  primary: { background: 'var(--green-600)', color: 'var(--ivory)', border: '1px solid var(--green-600)' },
  secondary: { background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-default)' },
  gold: { background: 'var(--gold-500)', color: 'var(--green-950)', border: '1px solid var(--gold-500)' },
  ghost: { background: 'transparent', color: 'var(--text-brand)', border: '1px solid transparent' },
  danger: { background: 'var(--negative)', color: 'var(--ivory)', border: '1px solid var(--negative)' },
};

export function Button({ variant = 'primary', size = 'md', icon, iconRight, full, disabled, children, style, ...rest }: ButtonProps) {
  const s = sizes[size];
  const v = variants[variant];
  return (
    <button disabled={disabled} style={{
      display: full ? 'flex' : 'inline-flex', width: full ? '100%' : undefined,
      alignItems: 'center', justifyContent: 'center', gap: 8, height: s.height, padding: s.padding,
      borderRadius: s.radius, fontFamily: 'var(--font-sans)', fontSize: s.fontSize, fontWeight: 600,
      letterSpacing: '0.01em', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
      whiteSpace: 'nowrap', transition: 'background var(--dur-fast), box-shadow var(--dur-fast), transform var(--dur-fast)',
      ...v, ...style,
    }} onMouseDown={e => { if (!disabled) (e.currentTarget as HTMLElement).style.transform = 'translateY(1px)'; }}
      onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }} {...rest}>
      {icon && <Icon name={icon} size={s.fontSize + 3} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.fontSize + 3} />}
    </button>
  );
}
