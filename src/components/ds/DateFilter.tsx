'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Icon } from './Icon';

export interface DateRange {
  from: string;
  to: string;
  label: string;
}

interface DateFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  dataFrom: string;
  dataTo: string;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return isoDate(d);
}

function fmtRange(from: string, to: string): string {
  const f = new Date(from + 'T00:00:00');
  const t = new Date(to + 'T00:00:00');
  const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
  if (from === to) return f.toLocaleDateString('en-GB', { ...opts, year: 'numeric' });
  if (f.getFullYear() === t.getFullYear()) {
    return f.toLocaleDateString('en-GB', opts) + ' – ' + t.toLocaleDateString('en-GB', { ...opts, year: 'numeric' });
  }
  return f.toLocaleDateString('en-GB', { ...opts, year: 'numeric' }) + ' – ' + t.toLocaleDateString('en-GB', { ...opts, year: 'numeric' });
}

function fmtShort(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

interface Preset {
  label: string;
  from: string;
  to: string;
}

function buildPresets(dataFrom: string, dataTo: string): Preset[] {
  const presets: Preset[] = [
    { label: 'All', from: dataFrom, to: dataTo },
  ];

  const lastDate = new Date(dataTo + 'T00:00:00');
  const firstDate = new Date(dataFrom + 'T00:00:00');
  const totalDays = Math.round((lastDate.getTime() - firstDate.getTime()) / 86400000);

  if (totalDays >= 1) {
    presets.push({ label: fmtShort(dataTo), from: dataTo, to: dataTo });
  }

  if (totalDays >= 7) {
    presets.push({ label: 'Last 7 days', from: addDays(dataTo, -6), to: dataTo });
  }

  if (totalDays >= 14) {
    presets.push({ label: 'Last 14 days', from: addDays(dataTo, -13), to: dataTo });
  }

  if (totalDays >= 7) {
    const mid = addDays(dataFrom, Math.floor(totalDays / 2));
    presets.push({ label: 'First half', from: dataFrom, to: mid });
  }

  return presets;
}

export function defaultRange(dataFrom: string, dataTo: string): DateRange {
  return { from: dataFrom, to: dataTo, label: 'All' };
}

export function DateFilter({ value, onChange, dataFrom, dataTo }: DateFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [customFrom, setCustomFrom] = useState(value.from);
  const [customTo, setCustomTo] = useState(value.to);

  const presets = useMemo(() => buildPresets(dataFrom, dataTo), [dataFrom, dataTo]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, close]);

  useEffect(() => {
    setCustomFrom(value.from);
    setCustomTo(value.to);
  }, [value.from, value.to]);

  const presetLabels = presets.map(p => p.label);
  const isPreset = presetLabels.includes(value.label);

  const applyCustom = () => {
    if (customFrom && customTo && customFrom <= customTo) {
      onChange({ from: customFrom, to: customTo, label: fmtRange(customFrom, customTo) });
      close();
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 14px', borderRadius: 'var(--radius-md)',
          background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
          fontSize: 13, color: 'var(--text-body)', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontWeight: 500,
          transition: 'border-color var(--dur-fast)',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
      >
        <Icon name="calendar" size={15} color="var(--gold-600)" />
        <span>{value.label}</span>
        <Icon name="chevron-down" size={14} color="var(--text-faint)" />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 6, zIndex: 50,
          background: 'var(--surface-card)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
          padding: 16, minWidth: 280,
          animation: 'ivpop var(--dur-normal) var(--ease-out)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 10 }}>
            Quick select
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {presets.map(preset => (
              <button
                key={preset.label}
                onClick={() => {
                  onChange({ from: preset.from, to: preset.to, label: preset.label });
                  close();
                }}
                style={{
                  padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: 12.5, fontWeight: 600,
                  border: '1px solid',
                  borderColor: value.label === preset.label ? 'var(--green-700)' : 'var(--border-subtle)',
                  background: value.label === preset.label ? 'var(--green-700)' : 'transparent',
                  color: value.label === preset.label ? '#fff' : 'var(--text-body)',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  transition: 'all var(--dur-fast)',
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 10 }}>
            Custom range
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <input
              type="date"
              value={customFrom}
              min={dataFrom}
              max={dataTo}
              onChange={e => setCustomFrom(e.target.value)}
              style={{
                flex: 1, padding: '7px 10px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)', fontSize: 13,
                fontFamily: 'var(--font-sans)', color: 'var(--text-body)',
                background: 'var(--surface-sunken)',
              }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>to</span>
            <input
              type="date"
              value={customTo}
              min={dataFrom}
              max={dataTo}
              onChange={e => setCustomTo(e.target.value)}
              style={{
                flex: 1, padding: '7px 10px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)', fontSize: 13,
                fontFamily: 'var(--font-sans)', color: 'var(--text-body)',
                background: 'var(--surface-sunken)',
              }}
            />
          </div>
          <button
            onClick={applyCustom}
            disabled={!customFrom || !customTo || customFrom > customTo}
            style={{
              width: '100%', padding: '8px 0', borderRadius: 'var(--radius-md)',
              background: (!customFrom || !customTo || customFrom > customTo) ? 'var(--stone-300)' : 'var(--green-700)',
              color: '#fff', border: 'none', fontSize: 13, fontWeight: 600,
              cursor: (!customFrom || !customTo || customFrom > customTo) ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Apply
          </button>
          {!isPreset && (
            <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--text-muted)', textAlign: 'center' }}>
              {fmtRange(value.from, value.to)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
