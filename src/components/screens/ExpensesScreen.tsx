'use client';

import { useState, useMemo } from 'react';
import { StatCard, Card, ProgressBar, Badge, DataTable, SearchField, Select, FilterChip } from '@/components/ds';
import { Icon } from '@/components/ds/Icon';
import { AreaChart } from '@/components/charts/AreaChart';
import * as E from '@/lib/expenseData';
import type { DateRange } from '@/components/ds/DateFilter';

function ExpSummary({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span className="ds-eyebrow">{label}</span>
      <span style={{ fontFamily: 'var(--font-num)', fontSize: strong ? 19 : 15, fontWeight: 700, color: tone || (strong ? 'var(--text-strong)' : 'var(--text-body)'), fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

function ExpenseDrawer({ row, onClose }: { row: E.ExpenseRow; onClose: () => void }) {
  const Line = ({ k, v, tone }: { k: string; v: string; tone?: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{k}</span>
      <span style={{ fontFamily: 'var(--font-num)', fontSize: 13.5, fontWeight: 600, color: tone || 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{v}</span>
    </div>
  );
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,24,21,0.35)', zIndex: 40, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 400, height: '100%', background: 'var(--surface-card)', boxShadow: 'var(--shadow-xl)', padding: 26, overflowY: 'auto', animation: 'ivslide var(--dur-base) var(--ease-out)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <span className="ds-eyebrow">EXP-{String(row.id).padStart(4, '0')} · {E.fmtDate(row.date)}</span>
            <h3 className="ds-display" style={{ fontSize: 24, margin: '4px 0 0' }}>{row.particular}</h3>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'var(--surface-sunken)', width: 34, height: 34, borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={17} color="var(--text-muted)" />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, margin: '14px 0 18px', flexWrap: 'wrap' }}>
          <Badge tone={row.branch}>{row.branchName}</Badge>
          <Badge tone={row.type === 'CapEx' ? 'gold' : 'neutral'}>{row.type}</Badge>
          <Badge tone={row.status === 'PAID' ? 'positive' : row.status === 'PENDING' ? 'warning' : 'info'} dot>{row.status}</Badge>
        </div>
        <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', marginBottom: 18 }}>
          <span className="ds-eyebrow">Category</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <Icon name={row.categoryIcon} size={18} color="var(--green-600)" />
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' }}>{row.categoryName}</span>
          </div>
        </div>
        <Line k="Amount" v={E.aed(row.amount)} />
        <Line k="Expense type" v={row.type} />
        <Line k="Category" v={row.categoryName} />
        <Line k="Paid by" v={row.paidBy} />
        <Line k="Approved" v={row.approved ? 'Yes' : 'No'} tone={row.approved ? 'var(--positive)' : 'var(--warning)'} />
        <Line k="Status" v={row.status} tone={row.status === 'PAID' ? 'var(--positive)' : row.status === 'PENDING' ? 'var(--warning)' : 'var(--info)'} />
        <Line k="Branch" v={row.branchName} />
        <Line k="Date" v={E.fmtDate(row.date)} />
      </div>
    </div>
  );
}

export function ExpensesScreen({ dateRange }: { dateRange: DateRange }) {
  const [q, setQ] = useState('');
  const [branch, setBranch] = useState('all');
  const [category, setCategory] = useState('all');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [paidBy, setPaidBy] = useState('all');
  const [sel, setSel] = useState<E.ExpenseRow | null>(null);
  const [catHi, setCatHi] = useState<number | null>(null);

  const rows = useMemo(() => E.ROWS.filter(r => {
    if (r.date < dateRange.from || r.date > dateRange.to) return false;
    if (branch !== 'all' && r.branch !== branch) return false;
    if (category !== 'all' && r.category !== category) return false;
    if (type !== 'all' && r.type !== type) return false;
    if (status !== 'all' && r.status !== status) return false;
    if (paidBy !== 'all' && r.paidBy !== paidBy) return false;
    if (q) { const s = (r.particular + ' ' + r.categoryName + ' ' + r.paidBy + ' ' + r.branchName).toLowerCase(); if (!s.includes(q.toLowerCase())) return false; }
    return true;
  }), [q, branch, category, type, status, paidBy, dateRange]);

  const t = E.totals(rows);

  const byCat = useMemo(() => {
    const m = E.groupBy(rows, 'category');
    return E.CATEGORIES.map(c => { const rs = m[c.key] || []; return { ...c, total: E.sum(rs, r => r.amount), count: rs.length }; }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);
  }, [rows]);
  const catMax = byCat[0]?.total || 1;

  const byBranch = useMemo(() => E.BRANCHES.map(b => { const rs = rows.filter(r => r.branch === b.key); return { ...b, total: E.sum(rs, r => r.amount), count: rs.length }; }).sort((a, b) => b.total - a.total), [rows]);

  const byPaidBy = useMemo(() => { const m = E.groupBy(rows, 'paidBy'); return Object.keys(m).map(k => ({ name: k, total: E.sum(m[k], r => r.amount), count: m[k].length })).sort((a, b) => b.total - a.total); }, [rows]);

  const series = useMemo(() => E.daily(rows), [rows]);

  const statusCounts = useMemo(() => { const m = E.groupBy(rows, 'status'); return { paid: (m['PAID'] || []).length, approved: (m['APPROVED'] || []).length, pending: (m['PENDING'] || []).length }; }, [rows]);

  let rise = 0;
  const Rise = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => { const i = rise++; return <div className="iv-rise" style={{ animationDelay: (i * 55) + 'ms', ...style }}>{children}</div>; };

  const catColors = ['var(--green-600)', 'var(--gold-500)', 'var(--green-400)', 'var(--stone-600)', 'var(--negative)', 'var(--info)', 'var(--green-300)', 'var(--gold-700)', 'var(--stone-400)', 'var(--green-800)', 'var(--warning)', 'var(--gold-300)', 'var(--stone-700)', 'var(--green-500)'];

  const columns = [
    { key: 'date', header: 'Date', nowrap: true, render: (r: E.ExpenseRow) => E.fmtDate(r.date) },
    { key: 'category', header: 'Category', render: (r: E.ExpenseRow) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Icon name={r.categoryIcon} size={14} color="var(--text-muted)" /><span style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{r.categoryName}</span></span> },
    { key: 'particular', header: 'Particular', render: (r: E.ExpenseRow) => <span style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, display: 'block' }}>{r.particular}</span> },
    { key: 'type', header: 'Type', render: (r: E.ExpenseRow) => <Badge tone={r.type === 'CapEx' ? 'gold' : 'neutral'}>{r.type}</Badge> },
    { key: 'branch', header: 'Branch', render: (r: E.ExpenseRow) => <Badge tone={r.branch}>{r.branchName}</Badge> },
    { key: 'paidBy', header: 'Paid By', render: (r: E.ExpenseRow) => <span style={{ fontSize: 13, color: 'var(--text-body)' }}>{r.paidBy}</span> },
    { key: 'status', header: 'Status', render: (r: E.ExpenseRow) => <Badge tone={r.status === 'PAID' ? 'positive' : r.status === 'PENDING' ? 'warning' : 'info'} dot>{r.status}</Badge> },
    { key: 'amount', header: 'Amount', align: 'right' as const, tnum: true, render: (r: E.ExpenseRow) => <span style={{ fontWeight: 700 }}>{E.aed(r.amount)}</span> },
  ];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        <Rise><StatCard label="Total expenses" value={Math.round(t.total)} icon="receipt" delta={-6.2} deltaDir="down" style={{ height: '100%' }} /></Rise>
        <Rise><StatCard label="OpEx (operational)" value={Math.round(t.opex)} accent="info" icon="trending-up" currency="AED" style={{ height: '100%' }} /></Rise>
        <Rise><StatCard label="CapEx (capital)" value={Math.round(t.capex)} accent="gold" icon="landmark" currency="AED" style={{ height: '100%' }} /></Rise>
        <Rise><StatCard label="Entries" value={t.count} currency="" accent="neutral" icon="file-text" style={{ height: '100%' }} /></Rise>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16 }}>
        <Rise style={{ minWidth: 0 }}>
          <Card pad={22} style={{ height: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
              <div>
                <span className="ds-eyebrow">Expense trend · June 2026</span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 500, color: 'var(--text-strong)', marginTop: 6, lineHeight: 0.95 }}>{E.aed(Math.round(t.total))}</div>
                <div style={{ marginTop: 7, fontSize: 12.5, color: 'var(--text-muted)' }}>{t.count} expenses across {rows.length > 0 ? [...new Set(rows.map(r => r.category))].length : 0} categories</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--info-soft)', fontSize: 12, fontWeight: 600, color: 'var(--info)' }}>OpEx {E.aed(Math.round(t.opex))}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--gold-100)', fontSize: 12, fontWeight: 600, color: 'var(--gold-700)' }}>CapEx {E.aed(Math.round(t.capex))}</span>
              </div>
            </div>
            <AreaChart data={series} color="var(--negative)" />
          </Card>
        </Rise>
        <Rise style={{ minWidth: 0 }}>
          <Card pad={22} style={{ height: '100%', boxSizing: 'border-box' }}>
            <span className="ds-eyebrow">By branch</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 16 }}>
              {byBranch.map(b => {
                const share = t.total > 0 ? Math.round((b.total / t.total) * 100) : 0;
                return (
                  <div key={b.key}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: b.color }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>{b.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>· {b.count} items</span>
                      <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-num)', fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{E.aed(Math.round(b.total))}</span>
                      <span style={{ width: 38, textAlign: 'right', fontSize: 12.5, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{share}%</span>
                    </div>
                    <ProgressBar value={share} color={b.color} />
                  </div>
                );
              })}
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 20, paddingTop: 16 }}>
              <span className="ds-eyebrow">Payment status</span>
              <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
                {[['Paid', statusCounts.paid, 'var(--positive)', 'var(--positive-soft)'], ['Pending', statusCounts.pending, 'var(--warning)', 'var(--warning-soft)'], ['Approved', statusCounts.approved, 'var(--info)', 'var(--info-soft)']].map(([lbl, cnt, clr, bg]) => (
                  <div key={lbl as string} style={{ flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: bg as string }}>
                    <div style={{ fontSize: 11, color: clr as string, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{lbl as string}</div>
                    <div style={{ fontFamily: 'var(--font-num)', fontSize: 18, fontWeight: 700, color: 'var(--text-strong)', marginTop: 2 }}>{cnt as number}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Rise>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Rise style={{ minWidth: 0 }}>
          <Card pad={22} style={{ height: '100%', boxSizing: 'border-box' }}>
            <span className="ds-eyebrow">Expense by category</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 14 }}>
              {byCat.slice(0, 8).map((c, i) => {
                const on = catHi === i, dim = catHi != null && !on;
                return (
                  <div key={c.key} onMouseEnter={() => setCatHi(i)} onMouseLeave={() => setCatHi(null)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: dim ? 0.4 : 1, transition: 'opacity 140ms', cursor: 'default' }}>
                    <span style={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={c.icon} size={14} color={catColors[i] || 'var(--text-muted)'} /></span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                        <span style={{ fontFamily: 'var(--font-num)', fontSize: 13, fontWeight: 700, color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums', marginLeft: 10 }}>{E.aed(Math.round(c.total))}</span>
                      </div>
                      <ProgressBar value={c.total} max={catMax} height={5} color={catColors[i] || 'var(--stone-400)'} />
                    </div>
                    <span style={{ width: 36, textAlign: 'right', fontSize: 12, color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>{c.count}×</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </Rise>
        <Rise style={{ minWidth: 0 }}>
          <Card pad={22} style={{ height: '100%', boxSizing: 'border-box' }}>
            <span className="ds-eyebrow">By who paid</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 14 }}>
              {byPaidBy.slice(0, 6).map((p, i) => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 18, fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, color: 'var(--gold-600)' }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>{p.name}</span>
                      <span style={{ fontFamily: 'var(--font-num)', fontSize: 13.5, fontWeight: 700, color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums', marginLeft: 10 }}>{E.aed(Math.round(p.total))}</span>
                    </div>
                    <ProgressBar value={p.total} max={byPaidBy[0]?.total || 1} height={5} color="var(--green-500)" />
                  </div>
                  <span style={{ width: 36, textAlign: 'right', fontSize: 12, color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>{p.count}×</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 18, paddingTop: 14 }}>
              <span className="ds-eyebrow">OpEx vs CapEx split</span>
              <div style={{ display: 'flex', height: 12, borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: 10, marginBottom: 8 }}>
                <div style={{ width: (t.total > 0 ? (t.opex / t.total * 100) : 50) + '%', background: 'var(--info)', transition: 'width 300ms' }} />
                <div style={{ flex: 1, background: 'var(--gold-500)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--info)' }} /><span style={{ color: 'var(--text-muted)' }}>OpEx</span><span style={{ fontWeight: 700, color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums' }}>{t.total > 0 ? Math.round(t.opex / t.total * 100) : 0}%</span></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--gold-500)' }} /><span style={{ color: 'var(--text-muted)' }}>CapEx</span><span style={{ fontWeight: 700, color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums' }}>{t.total > 0 ? Math.round(t.capex / t.total * 100) : 0}%</span></span>
              </div>
            </div>
          </Card>
        </Rise>
      </div>

      <Card pad={16} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <SearchField value={q} onChange={setQ} placeholder="Search particular, category, paid by…" width={300} />
        <Select icon="map-pin" value={branch} onChange={setBranch} options={[{ label: 'All branches', value: 'all' }, ...E.BRANCHES.map(b => ({ label: b.name, value: b.key }))]} />
        <Select value={category} onChange={setCategory} options={[{ label: 'All categories', value: 'all' }, ...E.CATEGORIES.map(c => ({ label: c.name, value: c.key }))]} />
        <div style={{ width: 1, height: 28, background: 'var(--border-subtle)' }} />
        <FilterChip label="OpEx" active={type === 'OpEx'} onClick={() => setType(s => s === 'OpEx' ? 'all' : 'OpEx')} />
        <FilterChip label="CapEx" active={type === 'CapEx'} onClick={() => setType(s => s === 'CapEx' ? 'all' : 'CapEx')} />
        <div style={{ width: 1, height: 28, background: 'var(--border-subtle)' }} />
        <FilterChip label="Paid" dot="var(--positive)" active={status === 'PAID'} onClick={() => setStatus(s => s === 'PAID' ? 'all' : 'PAID')} />
        <FilterChip label="Pending" dot="var(--warning)" active={status === 'PENDING'} onClick={() => setStatus(s => s === 'PENDING' ? 'all' : 'PENDING')} />
        <FilterChip label="Approved" dot="var(--info)" active={status === 'APPROVED'} onClick={() => setStatus(s => s === 'APPROVED' ? 'all' : 'APPROVED')} />
      </Card>

      <div style={{ display: 'flex', gap: 22, padding: '0 4px', flexWrap: 'wrap' }}>
        <ExpSummary label="Entries" value={E.fmt(t.count)} />
        <ExpSummary label="Total" value={E.aed(Math.round(t.total))} strong />
        <ExpSummary label="OpEx" value={E.aed(Math.round(t.opex))} />
        <ExpSummary label="CapEx" value={E.aed(Math.round(t.capex))} />
        <ExpSummary label="Paid" value={E.aed(Math.round(t.paid))} tone="var(--positive)" />
        <ExpSummary label="Pending" value={E.aed(Math.round(t.pending))} tone="var(--warning)" />
      </div>

      <DataTable columns={columns} rows={rows} onRowClick={setSel} />
      {sel && <ExpenseDrawer row={sel} onClose={() => setSel(null)} />}
    </div>
  );
}
