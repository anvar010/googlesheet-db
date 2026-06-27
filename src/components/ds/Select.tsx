'use client';

import { Icon } from './Icon';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  icon?: string;
  width?: number | string;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export function Select({ value, onChange, options, icon, width, size = 'md', style }: SelectProps) {
  const h = size === 'sm' ? 34 : 38;
  return (
    <div style={{ position: 'relative', display: 'inline-flex', width, ...style }}>
      {icon && <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }}><Icon name={icon} size={15} /></span>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: '100%', height: h, padding: icon ? '0 30px 0 32px' : '0 30px 0 12px', appearance: 'none', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', fontFamily: 'var(--font-sans)', fontSize: 13.5,
        fontWeight: 500, color: 'var(--text-body)', cursor: 'pointer', outline: 'none',
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }}>
        <Icon name="chevron-down" size={14} />
      </span>
    </div>
  );
}
