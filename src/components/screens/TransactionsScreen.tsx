'use client';

import { useState, useMemo } from 'react';
import { DataTable, Badge, SearchField, Select, FilterChip, Card } from '@/components/ds';
import { Icon } from '@/components/ds/Icon';
import * as D from '@/lib/data';
import type { DateRange } from '@/components/ds/DateFilter';

function Summary({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span className="ds-eyebrow">{label}</span>
      <span style={{ fontFamily: 'var(--font-num)', fontSize: strong ? 19 : 15, fontWeight: 700, color: tone || (strong ? 'var(--text-strong)' : 'var(--text-body)'), fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

function Drawer({ row, onClose }: { row: D.SalesRow; onClose: () => void }) {
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
            <span className="ds-eyebrow">{row.ref} · {D.fmtDate(row.date)}</span>
            <h3 className="ds-display" style={{ fontSize: 24, margin: '4px 0 0' }}>{row.client}</h3>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'var(--surface-sunken)', width: 34, height: 34, borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={17} color="var(--text-muted)" />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, margin: '14px 0 18px' }}>
          <Badge tone={row.branch}>{row.branchName}</Badge>
          <Badge tone="neutral" dot>{row.pay}</Badge>
        </div>
        <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', marginBottom: 18 }}>
          <span className="ds-eyebrow">Treatment</span>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', margin: '4px 0 2px' }}>{row.drip}</div>
          {!!row.nurse && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {row.source === 'peptides' ? 'Converted By' : 'Provider'} · {row.nurse}
            </div>
          )}
          {!!row.dosage && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Dosage · {row.dosage}</div>}
        </div>
        {row.source === 'justlife' ? (<>
          <Line k="Booking amount without Discount" v={D.aed(row.booking, 2)} />
          {!!row.discount   && <Line k="Discount given"       v={'−' + D.aed(row.discount, 2)} tone="var(--warning)" />}
          {!!row.jlPortal   && <Line k="Amount ON JL Portal"  v={D.aed(row.jlPortal, 2)} />}
          {!!row.location   && <Line k="LOCATION"             v={row.location} />}
          {!!row.contactNo  && <Line k="Contact No"           v={row.contactNo} />}
        </>) : row.source === 'peptides' ? (<>
          <Line k="VAT 5%"              v={D.aed(row.vat, 2)} />
          {!!row.deliveryCharges && <Line k="Delivery Charges" v={D.aed(row.deliveryCharges, 2)} />}
          {!!row.location   && <Line k="LOCATION"             v={row.location} />}
          {!!row.contactNo  && <Line k="NUMBER"               v={row.contactNo} />}
          {!!row.remarks    && <Line k="Remarks"              v={row.remarks} />}
        </>) : row.source === 'ivhome' ? (<>
          {!!row.cashAmt    && <Line k="CASH"                 v={D.aed(row.cashAmt,   2)} />}
          {!!row.posAmt     && <Line k="POS"                  v={D.aed(row.posAmt,    2)} />}
          {!!row.onlineAmt  && <Line k="ONLINE"               v={D.aed(row.onlineAmt, 2)} />}
          {!!row.prepaidDate && <Line k="PREPAID DATE"        v={row.prepaidDate} />}
          {!!row.location   && <Line k="LOCATION"             v={row.location} />}
          {!!row.contactNo  && <Line k="NUMBER"               v={row.contactNo} />}
          {!!row.upsell     && <Line k="Upsell Amt"           v={D.aed(row.upsell, 2)} />}
          {!!row.remarks    && <Line k="Remarks"              v={row.remarks} />}
        </>) : row.source === 'difc' || row.source === 'palm' ? (<>
          <Line k="VAT 5%"              v={D.aed(row.vat, 2)} />
          {!!row.ref          && <Line k="Sl No"              v={row.ref} />}
          {!!row.therapistName && <Line k={row.source === 'palm' ? 'Employee Name' : 'Therapist'} v={row.therapistName} />}
          {!!row.dailyRevenue && <Line k="Daily Revenue"      v={D.aed(row.dailyRevenue, 2)} />}
          {!!row.upsell       && <Line k="Upsell amount"      v={D.aed(row.upsell, 2)} />}
          {!!row.prepaidDate  && <Line k="Prepaid date"       v={row.prepaidDate} />}
          {!!row.sessionNo    && <Line k="Session no."        v={row.sessionNo} />}
          {!!row.remarks      && <Line k="Remarks"            v={row.remarks} />}
          {!!row.still        && <Line k="Still"              v={row.still} />}
          {!!row.palmAmount   && <Line k="Amount"             v={D.aed(row.palmAmount, 2)} />}
        </>) : (<>
          <Line k="Booking amount" v={D.aed(row.booking, 2)} />
          {!!row.discount && <Line k="Discount given" v={'−' + D.aed(row.discount, 2)} tone="var(--warning)" />}
          <Line k="Received (incl. VAT)" v={D.aed(row.received, 2)} />
          <Line k="Net (excl. VAT)" v={D.aed(row.net, 2)} />
          <Line k="VAT (5%)" v={D.aed(row.vat, 2)} />
          {!!row.commission && <Line k="IV commission" v={D.aed(row.commission, 2)} />}
          {!!row.partner && <Line k={row.partner >= 0 ? 'Partner receives' : 'Partner owes'} v={(row.partner >= 0 ? '+' : '−') + D.aed(Math.abs(row.partner), 2)} tone={row.partner >= 0 ? 'var(--positive)' : 'var(--negative)'} />}
          {!!row.upsell && <Line k="Upsell amount" v={D.aed(row.upsell, 2)} />}
          {!!row.location && <Line k="Location" v={row.location} />}
          {!!row.contactNo && <Line k="Contact No" v={row.contactNo} />}
          {!!row.remarks && <Line k="Remarks" v={row.remarks} />}
        </>)}
      </div>
    </div>
  );
}

const SOURCES = [
  { key: 'justlife', label: 'justlife'  },
  { key: 'ivhome',   label: 'ivhome'   },
  { key: 'peptides', label: 'peptides' },
  { key: 'difc',     label: 'difc'     },
  { key: 'palm',     label: 'palm'     },
];

export function TransactionsScreen({ vat, dateRange, dbRows }: { vat: string; dateRange: DateRange; dbRows?: D.SalesRow[] }) {
  const incl = vat !== 'excl';
  const [q, setQ] = useState('');
  const [pay, setPay] = useState<Record<string, boolean>>({});
  const [source, setSource] = useState('all');
  const [client, setClient] = useState('all');
  const [sel, setSel] = useState<D.SalesRow | null>(null);

  const payActive = Object.keys(pay).filter(k => pay[k]);

  const allRows = dbRows ?? [];

  const clientOptions = useMemo(() => {
    const names = [...new Set(allRows.map(r => r.client).filter(Boolean))].sort();
    return [{ label: 'All clients', value: 'all' }, ...names.map(n => ({ label: n, value: n }))];
  }, [allRows]);

  const rows = useMemo(() => allRows.filter(r => {
    if (r.date < dateRange.from || r.date > dateRange.to) return false;
    if (source !== 'all' && r.source !== source) return false;
    if (client !== 'all' && r.client !== client) return false;
    if (payActive.length && !pay[r.pay]) return false;
    if (q) { const s = (r.client + ' ' + r.ref + ' ' + r.drip + ' ' + r.nurse).toLowerCase(); if (!s.includes(q.toLowerCase())) return false; }
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [q, source, client, JSON.stringify(pay), dateRange, dbRows]);

  const t = D.totals(rows);

  const colDate  = { key: 'date',    header: 'Date',      nowrap: true, render: (r: D.SalesRow) => D.fmtDate(r.date) };
  const colClient= { key: 'client',  header: 'Client',    render: (r: D.SalesRow) => <span style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{r.client}</span> };
  const colCx    = { key: 'cx',      header: 'CX',        render: (r: D.SalesRow) => <span style={{ fontSize: 12, color: r.isNew ? 'var(--gold-600)' : 'var(--text-muted)' }}>{r.isNewLabel ?? (r.isNew ? 'New' : 'Existing')}</span> };
  const colRef   = { key: 'ref',     header: 'Ref',       nowrap: true, render: (r: D.SalesRow) => <span style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{r.ref || '—'}</span> };
  const colLoc     = { key: 'loc',       header: 'Location',  render: (r: D.SalesRow) => <span style={{ fontSize: 13, color: 'var(--text-body)' }}>{r.location || '—'}</span> };
  const colContact = { key: 'contactNo', header: 'Contact No', render: (r: D.SalesRow) => <span style={{ fontSize: 13, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{r.contactNo || '—'}</span> };
  const colTreat = { key: 'drip',    header: 'Treatment'  };
  const colNurse = { key: 'nurse',   header: 'Nurse'      };
  const colDosage= { key: 'dosage',  header: 'Dosage',    render: (r: D.SalesRow) => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.dosage || '—'}</span> };
  const colPay   = { key: 'pay',     header: 'Payment',   render: (r: D.SalesRow) => { const p = D.PAYMENTS.find(p => p.key === r.pay); return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: p?.color }} />{r.pay}</span>; } };
  const flex = (v: number) => v.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const colBook  = { key: 'booking', header: 'Booking',   align: 'right' as const, tnum: true, render: (r: D.SalesRow) => flex(r.booking) };
  const colDisc  = { key: 'disc',    header: 'Discount',  align: 'right' as const, tnum: true, render: (r: D.SalesRow) => r.discount ? <span style={{ color: 'var(--warning)' }}>−{flex(r.discount)}</span> : <span style={{ color: 'var(--text-faint)' }}>—</span> };
  const colRecv  = { key: 'val',     header: incl ? 'Received' : 'Net', align: 'right' as const, tnum: true, render: (r: D.SalesRow) => <span style={{ fontWeight: 700 }}>{flex(incl ? r.received : r.net)}</span> };
  const colNet   = { key: 'net',     header: 'Net',       align: 'right' as const, tnum: true, render: (r: D.SalesRow) => flex(r.net) };
  const colVat   = { key: 'vat',     header: 'VAT',       align: 'right' as const, tnum: true, render: (r: D.SalesRow) => flex(r.vat) };
  const colJL    = { key: 'jl',      header: 'JL Portal', align: 'right' as const, tnum: true, render: (r: D.SalesRow) => flex(r.jlPortal) };
  const colComm  = { key: 'comm',    header: 'IV Commission',align: 'right' as const, tnum: true, render: (r: D.SalesRow) => flex(r.commission) };
  const colPart  = { key: 'partner', header: 'Partner Receives or Owes',   align: 'right' as const, tnum: true, render: (r: D.SalesRow) => <span style={{ color: r.partner >= 0 ? 'var(--positive)' : 'var(--negative)', fontWeight: 600 }}>{r.partner >= 0 ? '+' : '−'}{flex(Math.abs(r.partner))}</span> };
  const colSrc   = { key: 'branch',  header: 'Source',    render: (r: D.SalesRow) => <Badge tone={r.branch}>{r.branchName}</Badge> };
  const colRem   = { key: 'remarks', header: 'Remarks',   render: (r: D.SalesRow) => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.remarks || '—'}</span> };
  const amt = (v?: number) => v ? <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{v.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span> : <span style={{ color: 'var(--text-faint)' }}>—</span>;
  const colCash     = { key: 'cashAmt',    header: 'CASH',          align: 'right' as const, tnum: true, render: (r: D.SalesRow) => amt(r.cashAmt) };
  const colPos      = { key: 'posAmt',     header: 'POS',           align: 'right' as const, tnum: true, render: (r: D.SalesRow) => amt(r.posAmt) };
  const colOnline   = { key: 'onlineAmt',  header: 'ONLINE',        align: 'right' as const, tnum: true, render: (r: D.SalesRow) => amt(r.onlineAmt) };
  const colOnlineVat= { key: 'onlineVat',  header: 'Online VAT',    align: 'right' as const, tnum: true, render: (r: D.SalesRow) => amt(r.onlineVat) };
  const colPosNoVat = { key: 'posNoVat',   header: 'POS no vat',    align: 'right' as const, tnum: true, render: (r: D.SalesRow) => amt(r.posNoVat) };
  const colClasspass= { key: 'classpass',  header: 'Classpass',     align: 'right' as const, tnum: true, render: (r: D.SalesRow) => amt(r.classpassAmt) };
  const colGroupon  = { key: 'groupon',    header: 'Groupon',       align: 'right' as const, tnum: true, render: (r: D.SalesRow) => amt(r.grouponAmt) };
  const colOnlineNoVat={ key:'onlineNoVat',header: 'Online no VAT', align: 'right' as const, tnum: true, render: (r: D.SalesRow) => amt(r.onlineNoVat) };
  const colSvcWithVat= { key: 'received',  header: 'Service Total With VAT', align: 'right' as const, tnum: true, render: (r: D.SalesRow) => amt(r.received) };
  const colDept     = { key: 'department', header: 'Department',    render: (r: D.SalesRow) => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.department || '—'}</span> };
  const colUpsell= { key: 'upsell',  header: 'Upsell',    align: 'right' as const, tnum: true, render: (r: D.SalesRow) => r.upsell ? D.aed(r.upsell) : <span style={{ color: 'var(--text-faint)' }}>—</span> };

  const columns =
    source === 'justlife' ? [
      colDate,
      { ...colClient, header: 'Client Name'        },
      { ...colRef,    header: 'Reference Code'     },
      { ...colPay,    header: 'Payment mode'       },
      { ...colNet,    header: 'Service Total no VAT' },
      { ...colTreat,  header: 'Service Name'       },
      { ...colNurse,  header: 'Provider'           },
      colComm,
      colPart,
    ] :
    source === 'ivhome'   ? [
      colDate,
      { ...colClient,  header: 'NAME'              },
      { ...colCx,      header: 'CX (existing/new)' },
      { ...colTreat,   header: 'Service Total no VAT' },
      { ...colBook,    header: 'Booking Amount'    },
      { ...colVat,     header: 'VAT 5%'            },
      { ...colPay,     header: 'Payment Method'    },
      { ...colNurse,   header: 'Provider'          },
    ] :
    source === 'peptides' ? [
      colDate,
      { ...colClient, header: 'NAME'              },
      { ...colCx,     header: 'CX (existing/new)' },
      { ...colTreat,  header: 'Service Name'      },
      { ...colNet,    header: 'Service Total no VAT' },
      colCash, colPos, colOnline,
      { ...colNurse,  header: 'Converted By'      },
    ] :
    source === 'difc'     ? [
      colDate,
      { ...colClient,  header: 'Name'             },
      { ...colCx,      header: 'New CX'           },
      colDept,
      { ...colNurse,   header: 'Provider'         },
      { ...colTreat,   header: 'Service Name'     },
      colSvcWithVat,
      { ...colNet,     header: 'Service Total no VAT' },
      { ...colCash,    header: 'Cash'             },
      colPos, colOnlineVat, colPosNoVat, colClasspass, colGroupon, colOnlineNoVat,
    ] :
    source === 'palm'     ? [
      colDate,
      { ...colClient,  header: 'Name'             },
      { ...colCx,      header: 'New CX'           },
      colDept,
      { ...colNurse,   header: 'Provider'         },
      { ...colTreat,   header: 'Service Name'     },
      colSvcWithVat,
      { ...colNet,     header: 'Service Total no VAT' },
      { ...colCash,    header: 'Cash'             },
      colPos, colOnlineVat, colPosNoVat, colClasspass, colGroupon, colOnlineNoVat,
    ] :
    [
      colDate,
      { ...colClient, header: 'Name'         },
      { ...colSrc,    header: 'Source'        },
      { ...colTreat,  header: 'Service Name'  },
      { ...colNurse,  header: 'Provider'      },
      { ...colPay,    header: 'Payment'       },
      { ...colRecv,   header: 'Amount'        },
    ];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card pad={16} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <SearchField value={q} onChange={setQ} placeholder="Search client, reference, treatment, nurse…" width={300} />
          <Select icon="users" value={client} onChange={setClient} options={clientOptions} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <FilterChip label="All" active={source === 'all'} onClick={() => setSource('all')} />
          {SOURCES.map(s => <FilterChip key={s.key} label={s.label} active={source === s.key} onClick={() => setSource(source === s.key ? 'all' : s.key)} />)}
          <div style={{ width: 1, height: 22, background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Payment</span>
          {D.PAYMENTS.map(p => <FilterChip key={p.key} label={p.key} dot={p.color} active={!!pay[p.key]} onClick={() => setPay(prev => ({ ...prev, [p.key]: !prev[p.key] }))} />)}
        </div>
      </Card>
      <div style={{ display: 'flex', gap: 22, padding: '0 4px', flexWrap: 'wrap' }}>
        <Summary label="Rows" value={D.fmt(t.count)} />
        <Summary label={incl ? 'Received incl. VAT' : 'Net excl. VAT'} value={D.aed(Math.round(incl ? t.received : t.net))} strong />
        <Summary label="Net" value={D.aed(Math.round(t.net))} />
        <Summary label="VAT" value={D.aed(Math.round(t.vat))} />
        <Summary label="Discounts" value={'−' + D.aed(Math.round(t.discount))} tone="var(--warning)" />
        <Summary label="Commission" value={D.aed(Math.round(t.commission))} />
      </div>
      <DataTable columns={columns} rows={rows} onRowClick={setSel} />
      {sel && <Drawer row={sel} onClose={() => setSel(null)} />}
    </div>
  );
}
