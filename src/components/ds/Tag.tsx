'use client';

import { Icon } from './Icon';

interface TagProps {
  label: string;
  color?: string;
  icon?: string;
  onRemove?: () => void;
  style?: React.CSSProperties;
}

export function Tag({ label, color = 'var(--green-600)', icon, onRemove, style }: TagProps) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, height: 26, padding: '0 10px',
      borderRadius: 'var(--radius-full)', background: color + '14', color, fontSize: 12, fontWeight: 600, ...style,
    }}>
      {icon && <Icon name={icon} size={13} />}
      {label}
      {onRemove && (
        <button onClick={onRemove} style={{ display: 'flex', alignItems: 'center', border: 'none', background: 'none', color: 'inherit', cursor: 'pointer', padding: 0, marginLeft: 2, opacity: 0.6 }}>
          <Icon name="x" size={12} />
        </button>
      )}
    </span>
  );
}
