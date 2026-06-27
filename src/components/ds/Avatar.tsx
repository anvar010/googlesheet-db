'use client';

import React from 'react';

export interface AvatarProps {
  name?: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
}

export function Avatar({
  name,
  size = 34,
  color = 'var(--green-600)',
  style,
}: AvatarProps) {
  const initials = getInitials(name);
  const fontSize = Math.round(size * 0.38);

  return (
    <div
      aria-label={name || 'Avatar'}
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        background: 'var(--green-50)',
        border: '1px solid var(--green-100)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans, sans-serif)',
        fontSize,
        fontWeight: 600,
        color,
        lineHeight: 1,
        userSelect: 'none',
        ...style,
      }}
    >
      {initials}
    </div>
  );
}
