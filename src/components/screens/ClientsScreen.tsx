'use client';

import { useState, useMemo } from 'react';
import { Card, Badge, DataTable, SearchField, Select, FilterChip, ProgressBar, Avatar } from '@/components/ds';
import { Icon } from '@/components/ds/Icon';
import * as D from '@/lib/data';
import type { DateRange } from '@/components/ds/DateFilter';

function CxSummary({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span className="ds-eyebrow">{label}</span>
      <span style={{ fontFamily: 'var(--font-num)', fontSize: strong ? 19 : 15, fontWeight: 700, color: tone || (strong ? 'var(--text-strong)' : 'var(--text-body)'), fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

interface ClientProfile {
  name: string; visits: D.SalesRow[]; branches: string[]; treatments: string[]; isNew: boolean;
  firstVisit: string; lastVisit: string; visitCount: number; totalSpent: number; totalDiscount: number;
  avgSpend: number; topTreatment: string;
}

function ClientDrawer({ client, onClose, incl }: { client: ClientProfile; onClose: () => void; incl: boolean }) {
  const visits = [...client.visits].sort((a, b) => b.date.localeCompare(a.date));
  const treatmentMap: Record<string, number> = {};
  visits.forEach(v => { treatmentMap[v.drip] = (treatmentMap[v.drip] || 0) + 1; });
  const topTreatments = Object.entries(treatmentMap).sort((a, b) => b[1] - a[1]);

  const Line = ({ k, v, tone }: { k: string; v: string; tone?: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{k}</span>
      <span style={{ fontFamily: 'var(--font-num)', fontSize: 13.5, fontWeight: 600, color: tone || 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{v}</span>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,24,21,0.35)', zIndex: 40, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 420, height: '100%', background: 'var(--surface-card)', boxShadow: 'var(--shadow-xl)', padding: 26, overflowY: 'auto', animation: 'ivslide var(--dur-base) var(--ease-out)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={client.name} size={44} />
            <div>
              <h3 className="ds-display" style={{ fontSize: 22, margin: 0 }}>{client.name}</h3>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <Badge tone={client.isNew ? 'gold' : 'positive'} dot>{client.isNew ? 'New client' : 'Returning client'}</Badge>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'var(--surface-sunken)', width: 34, height: 34, borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={17} color="var(--text-muted)" />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '18px 0' }}>
          <div style={{ padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
            <div className="ds-eyebrow" style={{ marginBottom: 4 }}>Total spent</div>
            <div style={{ fontFamily: 'var(--font-num)', fontSize: 20, fontWeight: 700, color: 'var(--text-strong)' }}>{D.aed(Math.round(client.totalSpent))}</div>
          </div>
          <div style={{ padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
            <div className="ds-eyebrow" style={{ marginBottom: 4 }}>Visits</div>
            <div style={{ fontFamily: 'var(--font-num)', fontSize: 20, fontWeight: 700, color: 'var(--text-strong)' }}>{client.visitCount}</div>
          </div>
        </div>
        <Line k="Average per visit" v={D.aed(Math.round(client.avgSpend))} />
        <Line k="Discounts received" v={D.aed(Math.round(client.totalDiscount))} tone={client.totalDiscount > 0 ? 'var(--warning)' : undefined} />
        <Line k="First visit" v={D.fmtDate(client.firstVisit)} />
        <Line k="Last visit" v={D.fmtDate(client.lastVisit)} />
        <Line k="Branches visited" v={client.branches.join(', ')} />
        <div style={{ marginTop: 18 }}>
          <span className="ds-eyebrow">Treatments</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {topTreatments.map(([name, count]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums', marginLeft: 8 }}>{count}×</span>
                  </div>
                  <ProgressBar value={count} max={topTreatments[0]?.[1] as number || 1} height={4} color="var(--green-500)" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <span className="ds-eyebrow">Visit history</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 10 }}>
            {visits.slice(0, 10).map(v => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div><span style={{ fontSize: 13, color: 'var(--text-body)' }}>{v.drip}</span><span style={{ fontSize: 12, color: 'var(--text-faint)', marginLeft: 8 }}>{D.fmtDate(v.date)}</span></div>
                <span style={{ fontFamily: 'var(--font-num)', fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{D.aed(incl ? v.received : v.net)}</span>
              </div>
            ))}
            {visits.length > 10 && <div style={{ fontSize: 12, color: 'var(--text-faint)', padding: '8px 0', textAlign: 'center' }}>+ {visits.length - 10} more visits</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClientsScreen({ vat, dateRange, dbRows }: { vat: string; dateRange: DateRange; dbRows?: D.SalesRow[] }) {
  const incl = vat !== 'excl';
  const [q, setQ] = useState('');
  const [branch, setBranch] = useState('all');
  const [clientType, setClientType] = useState('all');
  const [sortBy, setSortBy] = useState('spent');
  const [sel, setSel] = useState<ClientProfile | null>(null);

  const allClients = useMemo(() => {
    const m: Record<string, { name: string; visits: D.SalesRow[]; branches: Set<string>; treatments: Set<string>; isNew: boolean; firstVisit: string; lastVisit: string }> = {};
    (dbRows ?? D.ROWS).filter(r => r.date >= dateRange.from && r.date <= dateRange.to).forEach(r => {
      if (!m[r.client]) m[r.client] = { name: r.client, visits: [], branches: new Set(), treatments: new Set(), isNew: false, firstVisit: r.date, lastVisit: r.date };
      const c = m[r.client];
      c.visits.push(r);
      c.branches.add(r.branchName);
      c.treatments.add(r.drip);
      if (r.date < c.firstVisit) { c.firstVisit = r.date; c.isNew = r.isNew; }
      if (r.date > c.lastVisit) c.lastVisit = r.date;
    });
    return Object.values(m).map(c => ({
      ...c, visitCount: c.visits.length,
      totalSpent: D.sum(c.visits, r => incl ? r.received : r.net),
      totalDiscount: D.sum(c.visits, r => r.discount),
      avgSpend: D.sum(c.visits, r => incl ? r.received : r.net) / c.visits.length,
      branches: [...c.branches], treatments: [...c.treatments],
      topTreatment: (() => { const tm: Record<string, number> = {}; c.visits.forEach(v => { tm[v.drip] = (tm[v.drip] || 0) + 1; }); return Object.entries(tm).sort((a, b) => b[1] - a[1])[0]?.[0] || ''; })(),
    }));
  }, [incl, dateRange, dbRows]);

  const clients = useMemo(() => {
    let list = [...allClients];
    if (branch !== 'all') list = list.filter(c => c.branches.includes(branch === 'difc' ? 'DIFC' : branch === 'palm' ? 'Palm Jumeirah' : 'IV Home'));
    if (clientType === 'new') list = list.filter(c => c.isNew);
    if (clientType === 'returning') list = list.filter(c => !c.isNew);
    if (q) list = list.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));
    if (sortBy === 'spent') list.sort((a, b) => b.totalSpent - a.totalSpent);
    else if (sortBy === 'visits') list.sort((a, b) => b.visitCount - a.visitCount);
    else if (sortBy === 'recent') list.sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [allClients, q, branch, clientType, sortBy]);

  const totalClients = allClients.length;
  const newClients = allClients.filter(c => c.isNew).length;
  const returningClients = totalClients - newClients;
  const totalRevenue = D.sum(clients, c => c.totalSpent);

  const topSpenders = useMemo(() => [...allClients].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5), [allClients]);
  const mostFrequent = useMemo(() => [...allClients].sort((a, b) => b.visitCount - a.visitCount).slice(0, 5), [allClients]);
  const treatmentPop = useMemo(() => { const m: Record<string, number> = {}; allClients.forEach(c => c.treatments.forEach(t => { m[t] = (m[t] || 0) + 1; })); return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, count]) => ({ name, count })); }, [allClients]);

  let rise = 0;
  const Rise = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => { const i = rise++; return <div className="iv-rise" style={{ animationDelay: (i * 55) + 'ms', ...style }}>{children}</div>; };

  const columns = [
    { key: 'name', header: 'Client', render: (r: ClientProfile) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><Avatar name={r.name} size={32} /><div><span style={{ fontWeight: 600, color: 'var(--text-strong)', display: 'block' }}>{r.name}</span><span style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>{r.treatments.length} treatment{r.treatments.length !== 1 ? 's' : ''}</span></div></span> },
    { key: 'type', header: 'Type', render: (r: ClientProfile) => <Badge tone={r.isNew ? 'gold' : 'positive'} dot>{r.isNew ? 'New' : 'Returning'}</Badge> },
    { key: 'visitCount', header: 'Visits', align: 'right' as const, tnum: true, render: (r: ClientProfile) => <span style={{ fontWeight: 600 }}>{r.visitCount}</span> },
    { key: 'topTreatment', header: 'Top treatment', render: (r: ClientProfile) => <span style={{ fontSize: 13, color: 'var(--text-body)' }}>{r.topTreatment}</span> },
    { key: 'branches', header: 'Branches', render: (r: ClientProfile) => <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{r.branches.map(b => <Badge key={b} tone={b === 'DIFC' ? 'difc' : b === 'Palm Jumeirah' ? 'palm' : 'home'}>{b}</Badge>)}</div> },
    { key: 'lastVisit', header: 'Last visit', nowrap: true, render: (r: ClientProfile) => D.fmtDate(r.lastVisit) },
    { key: 'totalSpent', header: incl ? 'Total spent' : 'Total (net)', align: 'right' as const, tnum: true, render: (r: ClientProfile) => <span style={{ fontWeight: 700 }}>{D.aed(Math.round(r.totalSpent))}</span> },
  ];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[[Icon, 'users', 'Total clients', totalClients, 'var(--positive-soft)', 'var(--green-600)', 'var(--text-strong)', null],
          [Icon, 'user-plus', 'New clients', newClients, 'var(--gold-100)', 'var(--gold-600)', 'var(--gold-700)', totalClients > 0 ? Math.round(newClients / totalClients * 100) + '% of total' : null],
          [Icon, 'user-check', 'Returning clients', returningClients, 'var(--positive-soft)', 'var(--green-600)', 'var(--positive)', totalClients > 0 ? Math.round(returningClients / totalClients * 100) + '% of total' : null],
          [Icon, 'bar-chart-3', 'Avg spend / client', D.aed(totalClients > 0 ? Math.round(totalRevenue / totalClients) : 0), 'var(--info-soft)', 'var(--info)', 'var(--text-strong)', null]
        ].map(([, icon, label, val, bg, clr, valClr, sub], i) => (
          <Rise key={i}>
            <Card pad={20} style={{ height: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: bg as string, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={icon as string} size={18} color={clr as string} />
                </span>
                <span className="ds-eyebrow">{label as string}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 500, color: valClr as string, lineHeight: 1 }}>{val as string | number}</div>
              {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub as string}</div>}
            </Card>
          </Rise>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <Rise style={{ minWidth: 0 }}>
          <Card pad={22} style={{ height: '100%', boxSizing: 'border-box' }}>
            <span className="ds-eyebrow">New vs returning</span>
            <div style={{ display: 'flex', height: 14, borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: 14, marginBottom: 10 }}>
              <div style={{ width: (totalClients > 0 ? (newClients / totalClients * 100) : 0) + '%', background: 'var(--gold-500)', transition: 'width 300ms' }} />
              <div style={{ flex: 1, background: 'var(--green-500)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 20 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--gold-500)' }} /><span style={{ color: 'var(--text-muted)' }}>New</span><span style={{ fontWeight: 700, color: 'var(--text-body)' }}>{newClients}</span></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--green-500)' }} /><span style={{ color: 'var(--text-muted)' }}>Returning</span><span style={{ fontWeight: 700, color: 'var(--text-body)' }}>{returningClients}</span></span>
            </div>
            <span className="ds-eyebrow">Popular treatments</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              {treatmentPop.map((t, i) => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                  <span style={{ width: 16, fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 600, color: 'var(--gold-600)' }}>{i + 1}</span>
                  <span style={{ flex: 1, color: 'var(--text-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--text-muted)' }}>{t.count} clients</span>
                </div>
              ))}
            </div>
          </Card>
        </Rise>
        {[{ data: topSpenders, label: 'Top spenders', metric: (c: ClientProfile) => D.aed(Math.round(c.totalSpent)), maxVal: topSpenders[0]?.totalSpent || 1, valField: 'totalSpent' as const },
          { data: mostFrequent, label: 'Most frequent', metric: (c: ClientProfile) => c.visitCount + ' visits', maxVal: mostFrequent[0]?.visitCount || 1, valField: 'visitCount' as const }].map(({ data, label, metric, maxVal, valField }) => (
          <Rise key={label} style={{ minWidth: 0 }}>
            <Card pad={22} style={{ height: '100%', boxSizing: 'border-box' }}>
              <span className="ds-eyebrow">{label}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
                {data.map((c, i) => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 18, fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, color: 'var(--gold-600)' }}>{i + 1}</span>
                    <Avatar name={c.name} size={28} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                        <span style={{ fontFamily: 'var(--font-num)', fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginLeft: 8 }}>{metric(c)}</span>
                      </div>
                      <ProgressBar value={c[valField]} max={maxVal} height={4} color={valField === 'totalSpent' ? 'var(--green-500)' : 'var(--gold-500)'} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Rise>
        ))}
      </div>

      <Card pad={16} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <SearchField value={q} onChange={setQ} placeholder="Search client name…" width={280} />
        <Select icon="map-pin" value={branch} onChange={setBranch} options={[{ label: 'All branches', value: 'all' }, ...D.BRANCHES.map(b => ({ label: b.name, value: b.key }))]} />
        <div style={{ width: 1, height: 28, background: 'var(--border-subtle)' }} />
        <FilterChip label="All" active={clientType === 'all'} onClick={() => setClientType('all')} />
        <FilterChip label="New" dot="var(--gold-500)" active={clientType === 'new'} onClick={() => setClientType('new')} />
        <FilterChip label="Returning" dot="var(--green-500)" active={clientType === 'returning'} onClick={() => setClientType('returning')} />
        <div style={{ width: 1, height: 28, background: 'var(--border-subtle)' }} />
        <Select icon="arrow-up-down" value={sortBy} onChange={setSortBy} options={[{ label: 'Sort by spend', value: 'spent' }, { label: 'Sort by visits', value: 'visits' }, { label: 'Sort by recent', value: 'recent' }, { label: 'Sort by name', value: 'name' }]} />
      </Card>

      <div style={{ display: 'flex', gap: 22, padding: '0 4px', flexWrap: 'wrap' }}>
        <CxSummary label="Clients" value={D.fmt(clients.length)} />
        <CxSummary label="Total revenue" value={D.aed(Math.round(totalRevenue))} strong />
        <CxSummary label="Avg / client" value={D.aed(clients.length > 0 ? Math.round(totalRevenue / clients.length) : 0)} />
        <CxSummary label="New" value={String(clients.filter(c => c.isNew).length)} tone="var(--gold-700)" />
        <CxSummary label="Returning" value={String(clients.filter(c => !c.isNew).length)} tone="var(--positive)" />
      </div>

      <DataTable columns={columns} rows={clients} onRowClick={setSel} />
      {sel && <ClientDrawer client={sel} onClose={() => setSel(null)} incl={incl} />}
    </div>
  );
}
