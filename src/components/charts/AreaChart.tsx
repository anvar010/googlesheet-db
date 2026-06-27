'use client';

import { useRef, useState, useEffect, useMemo } from 'react';

interface DataPoint {
  date: string;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  formatValue?: (v: number) => string;
}

export function AreaChart({
  data,
  height = 230,
  color = 'var(--green-600)',
  formatValue = (v) => `AED ${v.toLocaleString()}`,
}: AreaChartProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);

  const viewW = 760;
  const padX = 10;
  const padTop = 16;
  const padBot = 28;
  const plotW = viewW - padX * 2;
  const plotH = height - padTop - padBot;

  const gradientId = useMemo(
    () => `area-grad-${Math.random().toString(36).slice(2, 9)}`,
    [],
  );

  const maxVal = useMemo(
    () => Math.max(...data.map((d) => d.value), 1),
    [data],
  );

  const points = useMemo(() => {
    if (data.length === 0) return [];
    return data.map((d, i) => ({
      x: padX + (i / Math.max(data.length - 1, 1)) * plotW,
      y: padTop + plotH - (d.value / maxVal) * plotH,
    }));
  }, [data, maxVal, plotW, plotH]);

  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const bottom = padTop + plotH;
    return (
      linePath +
      ` L${points[points.length - 1].x},${bottom} L${points[0].x},${bottom} Z`
    );
  }, [linePath, points, plotH]);

  // Draw animation
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;

    // Force reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    el.getBoundingClientRect();

    el.style.transition = 'stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1)';
    el.style.strokeDashoffset = '0';

    const timer = setTimeout(() => setDrawn(true), 920);
    return () => clearTimeout(timer);
  }, [linePath]);

  const gridLines = [0.25, 0.5, 0.75, 1].map((frac) => padTop + plotH - frac * plotH);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (data.length === 0) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * viewW;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < points.length; i++) {
      const dist = Math.abs(points[i].x - mouseX);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    setHoverIndex(closest);
  };

  const handleMouseLeave = () => setHoverIndex(null);

  // Tooltip positioning
  const tooltipX = hoverIndex !== null ? points[hoverIndex].x : 0;
  const tooltipY = hoverIndex !== null ? points[hoverIndex].y : 0;
  const tooltipAnchor =
    tooltipX < 100 ? 'start' : tooltipX > viewW - 100 ? 'end' : 'middle';
  const tooltipDx = tooltipAnchor === 'start' ? 8 : tooltipAnchor === 'end' ? -8 : 0;

  // Date tick labels (every 8th point)
  const ticks = useMemo(() => {
    const result: { x: number; label: string }[] = [];
    for (let i = 0; i < data.length; i += 8) {
      const day = new Date(data[i].date).getDate();
      result.push({ x: points[i].x, label: String(day) });
    }
    return result;
  }, [data, points]);

  if (data.length === 0) return null;

  return (
    <svg
      viewBox={`0 0 ${viewW} ${height}`}
      preserveAspectRatio="none"
      width="100%"
      style={{ display: 'block', overflow: 'visible' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.12} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {gridLines.map((y, i) => (
        <line
          key={i}
          x1={padX}
          y1={y}
          x2={viewW - padX}
          y2={y}
          stroke="var(--border-subtle)"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
      ))}

      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradientId})`} />

      {/* Line */}
      <path
        ref={pathRef}
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Baseline dots every ~10th point */}
      {drawn &&
        points
          .filter((_, i) => i % 10 === 0)
          .map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={2.5}
              fill={color}
              opacity={0.5}
              style={{
                animation: 'fadeIn 300ms ease forwards',
              }}
            />
          ))}

      {/* Date tick labels */}
      {ticks.map((t, i) => (
        <text
          key={i}
          x={t.x}
          y={height - 6}
          textAnchor="middle"
          fontSize={11}
          fill="var(--text-tertiary, #999)"
        >
          {t.label}
        </text>
      ))}

      {/* Hover crosshair */}
      {hoverIndex !== null && (
        <>
          <line
            x1={points[hoverIndex].x}
            y1={padTop}
            x2={points[hoverIndex].x}
            y2={padTop + plotH}
            stroke="var(--border-subtle)"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
          <circle
            cx={points[hoverIndex].x}
            cy={points[hoverIndex].y}
            r={5}
            fill={color}
            stroke="#fff"
            strokeWidth={2}
          />
          {/* Tooltip */}
          <text
            x={tooltipX + tooltipDx}
            y={tooltipY - 22}
            textAnchor={tooltipAnchor}
            fontSize={12}
            fontWeight={600}
            fill="var(--text-primary, #222)"
          >
            {formatValue(data[hoverIndex].value)}
          </text>
          <text
            x={tooltipX + tooltipDx}
            y={tooltipY - 8}
            textAnchor={tooltipAnchor}
            fontSize={10}
            fill="var(--text-tertiary, #999)"
          >
            {data[hoverIndex].date}
          </text>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.5; }
        }
      `}</style>
    </svg>
  );
}
