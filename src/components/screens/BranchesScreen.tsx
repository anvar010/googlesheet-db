'use client';

import { useMemo } from 'react';
import { Card, Badge, ProgressBar, Legend } from '@/components/ds';
import { Icon } from '@/components/ds/Icon';
import * as D from '@/lib/data';
import type { DateRange } from '@/components/ds/DateFilter';

export function BranchesScreen({ vat, dateRange, dbRows }: { vat: string; dateRange: DateRange; dbRows?: D.SalesRow[] }) {
  const incl = vat !== 'excl';
  const rows = useMemo(() => (dbRows ?? D.ROWS).filter(r => r.date >= dateRange.from && r.date <= dateRange.to), [dateRange, dbRows]);
  const grand = D.sum(rows, r => incl ? r.received : r.net);

  const branches = D.BRANCHES.map(b => {
    const rs = rows.filter(r => r.branch === b.key);
    const tt = D.totals(rs);
    const pay = D.PAYMENTS.map(p => ({ key: p.key, color: p.color, value: D.sum(rs.filter(r => r.pay === p.key), r => incl ? r.received : r.net) })).filter(p => p.value > 0).sort((a, b) => b.value - a.value);
    const dm = D.groupBy(rs, 'drip');
    const topDrip = Object.keys(dm).map(k => ({ k, v: dm[k].length })).sort((a, b) => b.v - a.v)[0];
    return { ...b, tt, total: incl ? tt.received : tt.net, pay, topDrip };
  }).sort((a, b) => b.total - a.total);

  const Metric = ({ label, value, tone }: { label: string; value: string; tone?: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-num)', fontSize: 13.5, fontWeight: 700, color: tone || 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {branches.map(b => {
          const share = Math.round((b.total / grand) * 100);
          return (
            <Card key={b.key} pad={0} style={{ overflow: 'hidden' }}>
              <div style={{ height: 5, background: b.color }} />
              <div style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 4, background: b.color }} />
                  <h3 className="ds-display" style={{ fontSize: 21, margin: 0 }}>{b.name}</h3>
                  <Badge tone={b.key} style={{ marginLeft: 'auto' }}>{share}% share</Badge>
                </div>
                <div style={{ fontFamily: 'var(--font-num)', fontSize: 30, fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1 }}>{D.aed(Math.round(b.total))}</div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)', margin: '4px 0 16px' }}>{incl ? 'Received incl. VAT' : 'Net excl. VAT'} · {b.tt.count} transactions</div>
                <Metric label="Net (excl. VAT)" value={D.aed(Math.round(b.tt.net))} />
                <Metric label="VAT (5%)" value={D.aed(Math.round(b.tt.vat))} />
                <Metric label="Booking (pre-discount)" value={D.aed(Math.round(b.tt.booking))} />
                <Metric label="Discounts given" value={'−' + D.aed(Math.round(b.tt.discount))} tone="var(--warning)" />
                <Metric label="IV commission" value={D.aed(Math.round(b.tt.commission))} />
                <Metric label={b.tt.partner >= 0 ? 'Partner receives' : 'Partner owes'}
                  value={(b.tt.partner >= 0 ? '+' : '−') + D.aed(Math.abs(Math.round(b.tt.partner)))}
                  tone={b.tt.partner >= 0 ? 'var(--positive)' : 'var(--negative)'} />
                <div className="ds-eyebrow" style={{ margin: '16px 0 10px' }}>Payment mix</div>
                <div style={{ display: 'flex', height: 10, borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 12 }}>
                  {b.pay.map(p => <div key={p.key} style={{ width: (p.value / b.total * 100) + '%', background: p.color }} title={p.key} />)}
                </div>
                <Legend columns={2} items={b.pay.slice(0, 4).map(p => ({ label: p.key, color: p.color, value: Math.round(p.value / b.total * 100) + '%' }))} />
                <div style={{ marginTop: 16, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: b.soft, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="award" size={16} color={b.color} />
                  <span style={{ fontSize: 12.5, color: 'var(--text-body)' }}>Top treatment · <strong>{b.topDrip?.k}</strong></span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
