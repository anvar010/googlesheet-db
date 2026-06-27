'use client';

import { useState, useMemo } from 'react';
import { Card, Button, FilterChip, SegmentedControl, Select, DataTable, Badge } from '@/components/ds';
import { Icon } from '@/components/ds/Icon';
import * as D from '@/lib/data';
import type { DateRange } from '@/components/ds/DateFilter';

export function ReportBuilderScreen({ vat, onVat, dateRange, dbRows }: { vat: string; onVat: (v: string) => void; dateRange: DateRange; dbRows?: D.SalesRow[] }) {
  const incl = vat !== 'excl';
  const [branches, setBranches] = useState<Record<string, boolean>>({});
  const [pays, setPays] = useState<Record<string, boolean>>({});
  const [drips, setDrips] = useState<Record<string, boolean>>({});
  const [nurse, setNurse] = useState('all');
  const [group, setGroup] = useState('none');
  const [toast, setToast] = useState<string | null>(null);

  const bActive = Object.keys(branches).filter(k => branches[k]);
  const pActive = Object.keys(pays).filter(k => pays[k]);
  const dActive = Object.keys(drips).filter(k => drips[k]);

  const rows = useMemo(() => (dbRows ?? D.ROWS).filter(r => {
    if (r.date < dateRange.from || r.date > dateRange.to) return false;
    if (bActive.length && !branches[r.branch]) return false;
    if (pActive.length && !pays[r.pay]) return false;
    if (dActive.length && !drips[r.drip]) return false;
    if (nurse !== 'all' && r.nurse !== nurse) return false;
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [JSON.stringify(branches), JSON.stringify(pays), JSON.stringify(drips), nurse, dateRange, dbRows]);

  const t = D.totals(rows);
  const fire = (kind: string) => { setToast(kind); setTimeout(() => setToast(null), 2600); };

  const grouped = useMemo(() => {
    if (group === 'none') return null;
    const m = D.groupBy(rows, group as keyof D.SalesRow);
    return Object.keys(m).map(k => {
      const tt = D.totals(m[k]);
      const label = group === 'branch' ? (D.BRANCHES.find(b => b.key === k)?.name || k) : k;
      return { label, count: tt.count, received: tt.received, net: tt.net, vat: tt.vat, discount: tt.discount };
    }).sort((a, b) => b.received - a.received);
  }, [group, rows]);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 18 }}>
      <div className="ds-eyebrow" style={{ marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>
    </div>
  );

  return (
    <div style={{ padding: 28, display: 'grid', gridTemplateColumns: '320px 1fr', gap: 18, alignItems: 'start' }}>
      <Card pad={22} style={{ position: 'sticky', top: 92 }}>
        <h3 className="ds-display" style={{ fontSize: 20, margin: '0 0 4px' }}>Report filters</h3>
        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '0 0 18px' }}>Compose today&#39;s sales report. Leave a group empty to include all.</p>
        <Section title="Branch">{D.BRANCHES.map(b => <FilterChip key={b.key} label={b.name} dot={b.color} active={!!branches[b.key]} onClick={() => setBranches(s => ({ ...s, [b.key]: !s[b.key] }))} />)}</Section>
        <Section title="Payment mode">{D.PAYMENTS.map(p => <FilterChip key={p.key} label={p.key} dot={p.color} active={!!pays[p.key]} onClick={() => setPays(s => ({ ...s, [p.key]: !s[p.key] }))} />)}</Section>
        <Section title="Treatment">{D.DRIPS.slice(0, 8).map(d => <FilterChip key={d} label={d.replace(' Hub', '')} active={!!drips[d]} onClick={() => setDrips(s => ({ ...s, [d]: !s[d] }))} />)}</Section>
        <div className="ds-eyebrow" style={{ marginBottom: 10 }}>Nurse</div>
        <Select icon="user" value={nurse} onChange={setNurse} width="100%" options={[{ label: 'All nurses', value: 'all' }, ...D.NURSES.map(n => ({ label: n, value: n }))]} />
        <div style={{ height: 16 }} />
        <div className="ds-eyebrow" style={{ marginBottom: 10 }}>VAT basis</div>
        <SegmentedControl value={vat} onChange={onVat} style={{ width: '100%' }} options={[{ label: 'Incl. VAT', value: 'incl' }, { label: 'Excl. VAT', value: 'excl' }]} />
        <div style={{ height: 16 }} />
        <div className="ds-eyebrow" style={{ marginBottom: 10 }}>Group by</div>
        <SegmentedControl value={group} onChange={setGroup} size="sm" options={[{ label: 'None', value: 'none' }, { label: 'Branch', value: 'branch' }, { label: 'Payment', value: 'pay' }, { label: 'Treatment', value: 'drip' }]} />
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card pad={22}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div>
              <span className="ds-eyebrow">Sales report · 1–30 Jun 2025</span>
              <div style={{ fontFamily: 'var(--font-num)', fontSize: 26, fontWeight: 700, color: 'var(--text-strong)', marginTop: 3 }}>{D.aed(Math.round(incl ? t.received : t.net))}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{t.count} transactions · {bActive.length || 'all'} branch{bActive.length === 1 ? '' : 'es'} · {incl ? 'incl. VAT' : 'excl. VAT'}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              <Button variant="secondary" icon="file-text" onClick={() => fire('pdf')}>PDF</Button>
              <Button variant="gold" icon="file-spreadsheet" onClick={() => fire('excel')}>Excel / CSV</Button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginTop: 18 }}>
            {([['Received', D.aed(Math.round(t.received)), null], ['Net', D.aed(Math.round(t.net)), null], ['VAT 5%', D.aed(Math.round(t.vat)), 'var(--gold-700)'], ['Discounts', '−' + D.aed(Math.round(t.discount)), 'var(--warning)'], ['Partner', (t.partner >= 0 ? '+' : '−') + D.aed(Math.abs(Math.round(t.partner))), t.partner >= 0 ? 'var(--positive)' : 'var(--negative)']] as [string, string, string | null][]).map(([l, v, c]) => (
              <div key={l} style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)' }}>
                <div className="ds-eyebrow" style={{ marginBottom: 4 }}>{l}</div>
                <div style={{ fontFamily: 'var(--font-num)', fontSize: 15, fontWeight: 700, color: c || 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>

        {grouped ? (
          <Card pad={0} style={{ overflow: 'hidden' }}>
            <DataTable
              columns={[
                { key: 'label', header: group === 'branch' ? 'Branch' : group === 'pay' ? 'Payment mode' : 'Treatment', render: (r: Record<string, unknown>) => <span style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{r.label as string}</span> },
                { key: 'count', header: 'Sales', align: 'right', tnum: true },
                { key: 'net', header: 'Net', align: 'right', tnum: true, render: (r: Record<string, unknown>) => D.aed(Math.round(r.net as number)) },
                { key: 'vat', header: 'VAT', align: 'right', tnum: true, render: (r: Record<string, unknown>) => D.aed(Math.round(r.vat as number)) },
                { key: 'discount', header: 'Discounts', align: 'right', tnum: true, render: (r: Record<string, unknown>) => <span style={{ color: 'var(--warning)' }}>−{D.fmt(Math.round(r.discount as number))}</span> },
                { key: 'received', header: incl ? 'Received' : 'Total', align: 'right', tnum: true, render: (r: Record<string, unknown>) => <span style={{ fontWeight: 700 }}>{D.aed(Math.round(r.received as number))}</span> },
              ]}
              rows={grouped}
            />
          </Card>
        ) : (
          <Card pad={0} style={{ overflow: 'hidden' }}>
            <DataTable
              columns={[
                { key: 'date', header: 'Date', nowrap: true, render: (r: Record<string, unknown>) => D.fmtDate(r.date as string) },
                { key: 'client', header: 'Client', render: (r: Record<string, unknown>) => <span style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{r.client as string}</span> },
                { key: 'drip', header: 'Treatment' },
                { key: 'branch', header: 'Branch', render: (r: Record<string, unknown>) => <Badge tone={r.branch as string}>{r.branchName as string}</Badge> },
                { key: 'pay', header: 'Payment' },
                { key: 'net', header: 'Net', align: 'right', tnum: true, render: (r: Record<string, unknown>) => D.aed(r.net as number, 2) },
                { key: 'vat', header: 'VAT', align: 'right', tnum: true, render: (r: Record<string, unknown>) => D.aed(r.vat as number, 2) },
                { key: 'received', header: 'Received', align: 'right', tnum: true, render: (r: Record<string, unknown>) => <span style={{ fontWeight: 700 }}>{D.aed(r.received as number, 2)}</span> },
              ]}
              rows={rows.slice(0, 40)}
            />
            <div style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-faint)', textAlign: 'center', borderTop: '1px solid var(--border-subtle)' }}>
              Showing first 40 of {t.count} rows · full set included in export
            </div>
          </Card>
        )}
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 26, right: 26, zIndex: 50, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'var(--surface-inverse)', color: 'var(--ivory)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-xl)', animation: 'ivpop var(--dur-base) var(--ease-out)' }}>
          <span style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', background: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={toast === 'pdf' ? 'file-text' : 'file-spreadsheet'} size={16} />
          </span>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700 }}>{toast === 'pdf' ? 'PDF report generated' : 'Excel / CSV exported'}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-on-dark-muted)' }}>sales-report-jun-2025.{toast === 'pdf' ? 'pdf' : 'xlsx'} · {t.count} rows</div>
          </div>
        </div>
      )}
    </div>
  );
}
