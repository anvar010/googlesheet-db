'use client';

import { useState } from 'react';
import { Icon } from './Icon';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label?: string;
  icon?: string;
  error?: string;
  inputSize?: 'sm' | 'md' | 'lg';
  onValueChange?: (v: string) => void;
}

export function Input({ label, icon, error, inputSize = 'md', onValueChange, style, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  const h = inputSize === 'sm' ? 36 : inputSize === 'lg' ? 50 : 42;
  return (
    <div style={style}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 6 }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }}><Icon name={icon} size={17} /></span>}
        <input
          {...rest}
          onChange={e => onValueChange?.(e.target.value)}
          onFocus={e => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={e => { setFocused(false); rest.onBlur?.(e); }}
          style={{
            width: '100%', height: h, padding: icon ? '0 14px 0 38px' : '0 14px', borderRadius: 'var(--radius-md)',
            border: `1px solid ${error ? 'var(--negative)' : focused ? 'var(--green-400)' : 'var(--border-default)'}`,
            background: 'var(--surface-card)', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-body)',
            outline: 'none', boxShadow: focused ? 'var(--shadow-focus)' : 'none', transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)',
          }}
        />
      </div>
      {error && <div style={{ fontSize: 12, color: 'var(--negative)', marginTop: 4 }}>{error}</div>}
    </div>
  );
}
