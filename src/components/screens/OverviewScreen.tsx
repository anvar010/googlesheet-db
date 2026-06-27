'use client';

import { useState, useMemo } from 'react';
import { StatCard, Card, ProgressBar, SegmentedControl } from '@/components/ds';
import { Icon } from '@/components/ds/Icon';
import { AreaChart } from '@/components/charts/AreaChart';
import { Donut } from '@/components/charts/Donut';
import * as D from '@/lib/data';
import type { DateRange } from '@/components/ds/DateFilter';

export function OverviewScreen({ vat, onNav, dateRange, dbRows }: { vat: string; onNav?: (key: string) => void; dateRange: DateRange; dbRows?: D.SalesRow[] }) {
  const rows = useMemo(() => (dbRows ?? D.ROWS).filter(r => r.date >= dateRange.from && r.date <= dateRange.to), [dateRange, dbRows]);
  const t = D.totals(rows);
  const incl = vat !== 'excl';
  const headline = incl ? t.received : t.net;
  const [mode, setMode] = useState('Daily');
  const [payHi, setPayHi] = useState<number | null>(null);

  const byBranch = D.BRANCHES.map(b => {
    const rs = rows.filter(r => r.branch === b.key);
    return { ...b, total: D.sum(rs, r => incl ? r.received : r.net), count: rs.length };
  }).sort((a, b) => b.total - a.total);

  const byPay = D.PAYMENTS.map(p => {
    const rs = rows.filter(r => r.pay === p.key);
    return { key: p.key, name: p.key, color: p.color, value: D.sum(rs, r => incl ? r.received : r.net), count: rs.length };
  }).filter(p => p.value > 0).sort((a, b) => b.value - a.value);
  const payTotal = byPay.reduce((s, p) => s + p.value, 0) || 1;

  const dripMap = D.groupBy(rows, 'drip');
  const topDrips = Object.keys(dripMap).map(k => ({ name: k, value: D.sum(dripMap[k], r => incl ? r.received : r.net), count: dripMap[k].length })).sort((a, b) => b.value - a.value).slice(0, 6);
  const dripMax = topDrips[0]?.value || 1;

  const series = useMemo(() => {
    const base = D.daily(rows).map(d => incl ? d : { ...d, value: d.value / 1.05 });
    if (mode === 'Daily') return base;
    if (mode === 'Cumulative') { let s = 0; return base.map(d => ({ date: d.date, value: (s += d.value) })); }
    const out: { date: string; value: number }[] = [];
    for (let i = 0; i < base.length; i += 7) {
      const chunk = base.slice(i, i + 7);
      out.push({ date: chunk[0].date, value: chunk.reduce((s, d) => s + d.value, 0) });
    }
    return out;
  }, [mode, incl, rows]);

  let rise = 0;
  const Rise = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
    const i = rise++;
    return <div className="iv-rise" style={{ animationDelay: (i * 55) + 'ms', ...style }}>{children}</div>;
  };

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        <Rise><StatCard label={incl ? 'Received incl. VAT' : 'Net sales excl. VAT'} value={Math.round(headline)} net={incl ? Math.round(t.net) : undefined} vat={incl ? Math.round(t.vat) : undefined} delta={12.4} icon="wallet" onClick={() => onNav?.('transactions')} hint="Ledger" style={{ height: '100%' }} /></Rise>
        <Rise><StatCard label="VAT collected (5%)" value={Math.round(t.vat)} accent="gold" icon="receipt" delta={11.0} onClick={() => onNav?.('report')} hint="Report" style={{ height: '100%' }} /></Rise>
        <Rise><StatCard label="Discounts given" value={Math.round(t.discount)} accent="negative" icon="badge-percent" deltaDir="down" delta={-4.2} onClick={() => onNav?.('transactions')} hint="Detail" style={{ height: '100%' }} /></Rise>
        <Rise><StatCard label="Transactions" value={t.count} currency="" accent="info" icon="activity" delta={8.6} onClick={() => onNav?.('transactions')} hint="Open" style={{ height: '100%' }} /></Rise>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16 }}>
        <Rise style={{ minWidth: 0 }}>
          <Card pad={22} style={{ height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
              <div>
                <span className="ds-eyebrow">Sales trend · June 2025</span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 500, color: 'var(--text-strong)', marginTop: 6, lineHeight: 0.95 }}>{D.aed(Math.round(headline))}</div>
                <div style={{ marginTop: 7, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--text-muted)' }}>
                  <Icon name="arrow-up-right" size={14} color="var(--positive)" /><span style={{ fontWeight: 600, color: 'var(--text-body)' }}>+12.4%</span> vs May
                </div>
              </div>
              <SegmentedControl value={mode} onChange={setMode} options={['Daily', 'Weekly', 'Cumulative']} size="sm" />
            </div>
            <AreaChart data={series} />
          </Card>
        </Rise>
        <Rise style={{ minWidth: 0 }}>
          <Card pad={22} style={{ height: '100%', boxSizing: 'border-box' }}>
            <span className="ds-eyebrow">By payment mode</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14 }}>
              <Donut segments={byPay} label="MODES" onHover={setPayHi} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {byPay.map((p, i) => {
                  const on = payHi === i, dim = payHi != null && !on;
                  return (
                    <div key={p.key} onMouseEnter={() => setPayHi(i)} onMouseLeave={() => setPayHi(null)}
                      style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '5px 7px', borderRadius: 'var(--radius-sm)', background: on ? 'var(--surface-sunken)' : 'transparent', opacity: dim ? 0.45 : 1, transition: 'opacity 140ms, background 140ms', cursor: 'default' }}>
                      <span style={{ width: 9, height: 9, borderRadius: 3, background: p.color, flex: 'none' }} />
                      <span style={{ fontSize: 13, color: 'var(--text-body)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.key}</span>
                      <span style={{ fontSize: 11.5, color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>{Math.round(p.value / payTotal * 100)}%</span>
                      <span style={{ fontFamily: 'var(--font-num)', fontSize: 12.5, fontWeight: 700, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', minWidth: 58, textAlign: 'right' }}>{D.aed(Math.round(p.value))}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </Rise>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Rise style={{ minWidth: 0 }}>
          <Card pad={22} style={{ height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="ds-eyebrow">Branch performance</span>
              <button onClick={() => onNav?.('branches')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-brand)' }}>
                Compare <Icon name="arrow-right" size={13} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              {byBranch.map(b => {
                const share = Math.round((b.total / headline) * 100);
                return (
                  <div key={b.key} onClick={() => onNav?.('branches')} className="iv-branch-row"
                    style={{ cursor: 'pointer', padding: '4px 6px', margin: '-4px -6px', borderRadius: 'var(--radius-sm)', transition: 'background 140ms' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: b.color }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>{b.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>· {b.count} sales</span>
                      <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-num)', fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{D.aed(Math.round(b.total))}</span>
                      <span style={{ width: 38, textAlign: 'right', fontSize: 12.5, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{share}%</span>
                    </div>
                    <ProgressBar value={share} color={b.color} />
                  </div>
                );
              })}
            </div>
          </Card>
        </Rise>
        <Rise style={{ minWidth: 0 }}>
          <Card pad={22} style={{ height: '100%', boxSizing: 'border-box' }}>
            <span className="ds-eyebrow">Top treatments</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 16 }}>
              {topDrips.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 18, fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, color: 'var(--gold-600)' }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
                      <span style={{ fontFamily: 'var(--font-num)', fontSize: 13.5, fontWeight: 700, color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums', marginLeft: 10 }}>{D.aed(Math.round(d.value))}</span>
                    </div>
                    <ProgressBar value={d.value} max={dripMax} height={6} color="var(--green-500)" />
                  </div>
                  <span style={{ width: 40, textAlign: 'right', fontSize: 12, color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>{d.count}×</span>
                </div>
              ))}
            </div>
          </Card>
        </Rise>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        <Rise><Card pad={20} style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', boxSizing: 'border-box' }}>
          <span className="ds-eyebrow">Booking vs received</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 500, color: 'var(--text-strong)', lineHeight: 1 }}>{D.aed(Math.round(t.received))}</span>
            <span style={{ fontFamily: 'var(--font-num)', fontSize: 13, color: 'var(--text-faint)', textDecoration: 'line-through' }}>{D.aed(Math.round(t.booking))}</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--warning)', fontWeight: 600 }}>−{D.aed(Math.round(t.discount))} discounts ({Math.round(t.discount / t.booking * 100)}%)</div>
        </Card></Rise>
        <Rise><Card pad={20} style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', boxSizing: 'border-box' }}>
          <span className="ds-eyebrow">IV commission accrued</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 500, color: 'var(--text-strong)', lineHeight: 1 }}>{D.aed(Math.round(t.commission))}</span>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>across {t.count} sales</div>
        </Card></Rise>
        <Rise><Card pad={20} style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', boxSizing: 'border-box' }}>
          <span className="ds-eyebrow">Partner settlement</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 500, color: t.partner >= 0 ? 'var(--positive)' : 'var(--negative)', lineHeight: 1 }}>
            {t.partner >= 0 ? '+' : '−'}{D.aed(Math.abs(Math.round(t.partner)))}
          </span>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{t.partner >= 0 ? 'Partner receives' : 'Partner owes'} · net</div>
        </Card></Rise>
      </div>
    </div>
  );
}
