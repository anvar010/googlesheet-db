'use client';

import { useMemo } from 'react';
import { Card, DataTable, ProgressBar, Avatar } from '@/components/ds';
import * as D from '@/lib/data';
import type { DateRange } from '@/components/ds/DateFilter';

export function NursesScreen({ vat, dateRange, dbRows }: { vat: string; dateRange: DateRange; dbRows?: D.SalesRow[] }) {
  const incl = vat !== 'excl';
  const filtered = useMemo(() => (dbRows ?? D.ROWS).filter(r => r.date >= dateRange.from && r.date <= dateRange.to), [dateRange, dbRows]);
  const m = D.groupBy(filtered, 'nurse');
  const rows = Object.keys(m).map(n => {
    const tt = D.totals(m[n]);
    return { nurse: n, count: tt.count, value: incl ? tt.received : tt.net, commission: tt.commission };
  }).sort((a, b) => b.value - a.value);
  const max = rows[0]?.value || 1;

  return (
    <div style={{ padding: 28 }}>
      <Card pad={0} style={{ overflow: 'hidden' }}>
        <DataTable
          columns={[
            { key: 'rank', header: '#', width: 48, render: (r: Record<string, unknown>) => <span style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, color: 'var(--gold-600)' }}>{rows.findIndex(x => x.nurse === (r.nurse as string)) + 1}</span> },
            { key: 'nurse', header: 'Nurse', render: (r: Record<string, unknown>) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><Avatar name={r.nurse as string} size={30} /><span style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{r.nurse as string}</span></span> },
            { key: 'count', header: 'Sales', align: 'right', tnum: true },
            { key: 'share', header: 'Contribution', width: 200, render: (r: Record<string, unknown>) => <ProgressBar value={r.value as number} max={max} color="var(--green-500)" /> },
            { key: 'commission', header: 'Commission', align: 'right', tnum: true, render: (r: Record<string, unknown>) => D.aed(Math.round(r.commission as number)) },
            { key: 'value', header: incl ? 'Received' : 'Net', align: 'right', tnum: true, render: (r: Record<string, unknown>) => <span style={{ fontWeight: 700 }}>{D.aed(Math.round(r.value as number))}</span> },
          ]}
          rows={rows}
        />
      </Card>
    </div>
  );
}
