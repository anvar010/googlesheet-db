'use client';

import { Icon } from '@/components/ds/Icon';
import { SegmentedControl } from '@/components/ds/SegmentedControl';
import { Button } from '@/components/ds/Button';
import { DateFilter, type DateRange } from '@/components/ds/DateFilter';

interface TopbarProps {
  title: string;
  subtitle?: string;
  vat: string;
  onVat: (v: string) => void;
  dateRange: DateRange;
  onDateRange: (r: DateRange) => void;
  dataFrom: string;
  dataTo: string;
  onExport?: () => void;
  showVat?: boolean;
}

export function Topbar({ title, subtitle, vat, onVat, dateRange, onDateRange, dataFrom, dataTo, onExport, showVat = true }: TopbarProps) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 10, height: 'var(--topbar-h)', display: 'flex', alignItems: 'center',
      padding: '0 32px', gap: 16, background: 'var(--surface-page)', borderBottom: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--text-strong)', fontFamily: 'var(--font-serif)', letterSpacing: 'var(--tracking-tight)' }}>{title}</h1>
        {subtitle && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</div>}
      </div>
      <DateFilter value={dateRange} onChange={onDateRange} dataFrom={dataFrom} dataTo={dataTo} />
      {showVat && (
        <SegmentedControl options={[{ label: 'Incl. VAT', value: 'incl' }, { label: 'Excl. VAT', value: 'excl' }]} value={vat} onChange={onVat} size="sm" />
      )}
      {onExport && <Button variant="secondary" size="sm" icon="download" onClick={onExport}>Export</Button>}
    </header>
  );
}
