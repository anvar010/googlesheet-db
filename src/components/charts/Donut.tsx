'use client';

import { useState } from 'react';

interface Segment {
  name?: string;
  value: number;
  color: string;
}

interface DonutProps {
  segments: Segment[];
  size?: number;
  thickness?: number;
  label?: string;
  onHover?: (index: number | null) => void;
  formatValue?: (v: number) => string;
}

export function Donut({
  segments,
  size = 172,
  thickness = 26,
  label = 'TOTAL',
  onHover,
  formatValue = (v) => v.toLocaleString(),
}: DonutProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const center = size / 2;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = circumference * 0.006;

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  // Build segment arcs
  let cumulative = 0;
  const arcs = segments.map((seg) => {
    const fraction = total > 0 ? seg.value / total : 0;
    const dashLen = fraction * circumference - gap;
    const offset = -cumulative * circumference + circumference * 0.25; // -90deg rotation via offset
    cumulative += fraction;
    return {
      dasharray: `${Math.max(dashLen, 0)} ${circumference - Math.max(dashLen, 0)}`,
      dashoffset: offset,
    };
  });

  const handleHover = (index: number | null) => {
    setHoverIndex(index);
    onHover?.(index);
  };

  // Center text
  const centerValue =
    hoverIndex !== null
      ? formatValue(segments[hoverIndex].value)
      : String(segments.length);

  const centerLabel =
    hoverIndex !== null && segments[hoverIndex].name
      ? segments[hoverIndex].name!.toUpperCase()
      : label;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ overflow: 'visible' }}
      onMouseLeave={() => handleHover(null)}
    >
      {/* Background ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="var(--stone-100, #f5f5f4)"
        strokeWidth={thickness}
      />

      {/* Segments */}
      {segments.map((seg, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={seg.color}
          strokeWidth={
            hoverIndex === i ? thickness + 5 : thickness
          }
          strokeDasharray={arcs[i].dasharray}
          strokeDashoffset={arcs[i].dashoffset}
          strokeLinecap="butt"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: `${center}px ${center}px`,
            opacity: hoverIndex !== null && hoverIndex !== i ? 0.35 : 1,
            transition: 'opacity 200ms ease, stroke-width 200ms ease',
            cursor: 'pointer',
          }}
          onMouseEnter={() => handleHover(i)}
        />
      ))}

      {/* Center text */}
      <text
        x={center}
        y={center - 4}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={hoverIndex !== null ? 20 : 28}
        fontWeight={700}
        fill="var(--text-primary, #222)"
        style={{ transition: 'font-size 200ms ease' }}
      >
        {centerValue}
      </text>
      <text
        x={center}
        y={center + 18}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={9}
        fontWeight={600}
        letterSpacing={1}
        fill="var(--text-tertiary, #999)"
      >
        {centerLabel}
      </text>
    </svg>
  );
}
