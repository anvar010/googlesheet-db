'use client';

import { Icon } from './Icon';

interface SearchFieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: string;
  width?: number | string;
  style?: React.CSSProperties;
}

export function SearchField({ value, onChange, placeholder = 'Search…', icon = 'search', width, style }: SearchFieldProps) {
  return (
    <div style={{ position: 'relative', width, ...style }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }}>
        <Icon name={icon} size={16} />
      </span>
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: '100%', height: 38, padding: '0 12px 0 36px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)', background: 'var(--surface-card)', fontFamily: 'var(--font-sans)',
          fontSize: 13.5, color: 'var(--text-body)', outline: 'none', transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'var(--green-400)'; e.currentTarget.style.boxShadow = 'var(--shadow-focus)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
      />
    </div>
  );
}
