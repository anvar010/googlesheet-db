import type { SalesRow } from './data';

type RawRow = Record<string, string | null | undefined>;

const MONTH_MAP: Record<string, string> = {
  january: '01', february: '02', march: '03', april: '04',
  may: '05', june: '06', july: '07', august: '08',
  september: '09', october: '10', november: '11', december: '12',
};

function parseDate(raw: string | null | undefined): string {
  if (!raw) return '';
  const s = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  const m = s.toLowerCase().match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)/);
  if (m) {
    const mo = MONTH_MAP[m[2]];
    if (!mo) return '';
    const day = m[1].padStart(2, '0');
    const now = new Date();
    let year = now.getFullYear();
    // If the date would be more than 60 days in the future, assume previous year
    const candidate = new Date(`${year}-${mo}-${day}`);
    if (candidate.getTime() - now.getTime() > 60 * 24 * 60 * 60 * 1000) year--;
    return `${year}-${mo}-${day}`;
  }
  return '';
}

function n(v: string | null | undefined): number {
  if (!v) return 0;
  const p = parseFloat(String(v).replace(/,/g, ''));
  return isNaN(p) ? 0 : p;
}

function bool(v: string | null | undefined): boolean {
  if (!v) return false;
  return ['true', '1', 'yes'].includes(v.toLowerCase());
}

function normalizePayment(raw: string | null | undefined): string {
  if (!raw) return 'Cash';
  const s = raw.trim().toLowerCase();
  if (s.includes('justlife') || s === 'jl') return 'Justlife';
  if (s === 'cash') return 'Cash';
  if (s === 'pos' || s === 'card' || s.includes('card')) return 'Card';
  if (s === 'online' || s === 'transfer' || s === 'bank') return 'Transfer';
  if (s === 'link') return 'Link';
  if (s === 'tabby') return 'Tabby';
  return raw.trim() || 'Cash';
}

function derivePayment(cash: number, pos: number, online: number, classpass = 0, groupon = 0): string {
  const totals = [
    [cash, 'Cash'], [pos, 'Card'], [online, 'Transfer'],
    [classpass, 'Card'], [groupon, 'Transfer'],
  ] as [number, string][];
  const top = totals.filter(([v]) => v > 0).sort((a, b) => b[0] - a[0])[0];
  return top ? top[1] : 'Cash';
}

let _id = 0;

export function mapJustlife(rows: RawRow[]): SalesRow[] {
  return rows.flatMap(r => {
    const date = parseDate(r.date);
    if (!date) return [];
    const net = n(r.service_total_no_vat);
    const booking = n(r.booking_amount_without_discount) || net;
    const discount = n(r.discount_given);
    const jlPortal = n(r.amount_on_jl_portal);
    const received = net;
    return [{
      id: ++_id,
      date,
      client: r.client_name || '',
      isNew: false,
      ref: r.reference_code || '',
      pay: normalizePayment(r.payment_mode),
      jlPortal,
      booking,
      discount,
      received,
      net,
      vat: +(net * 0.05).toFixed(2),
      drip: r.service_name || '',
      branch: 'home',
      branchName: 'Justlife',
      nurse: r.provider || '',
      commission: n(r.iv_commission),
      partner: n(r.partner_receives_or_owes),
      dosage: r.dosage || '',
      source: 'justlife',
      location: r.location || '',
      contactNo: r.contact_no || '',
    }];
  });
}

export function mapIvhome(rows: RawRow[]): SalesRow[] {
  return rows.flatMap(r => {
    const date = parseDate(r.date);
    if (!date) return [];
    const net = n(r.booking_amount);
    const vat = n(r.vat_5_percent);
    const cash = n(r.cash), pos = n(r.pos), online = n(r.online);
    const received = (cash + pos + online) || +(net + vat).toFixed(2);
    return [{
      id: ++_id,
      date,
      client: r.name || '',
      isNew: bool(r.cx),
      ref: '',
      pay: derivePayment(cash, pos, online),
      jlPortal: 0,
      booking: net,
      discount: 0,
      received,
      net,
      vat,
      drip: r.service_total_no_vat || '',
      branch: 'home',
      branchName: 'IV Home',
      nurse: r.provider || '',
      commission: 0,
      partner: 0,
      dosage: r.dosage || '',
      source: 'ivhome',
      location: r.location || '',
      contactNo: r.number || '',
      remarks: r.remarks || '',
      upsell: n(r.upsell_amt),
      isNewLabel: bool(r.cx) ? 'New' : 'Existing',
      cashAmt: cash,
      posAmt: pos,
      onlineAmt: online,
      prepaidDate: r.prepaid_date || '',
    }];
  });
}

export function mapPeptides(rows: RawRow[]): SalesRow[] {
  return rows.flatMap(r => {
    const date = parseDate(r.date);
    if (!date) return [];
    const net = n(r.service_total_no_vat);
    const vat = n(r.vat_5_percent);
    const cash = n(r.cash), pos = n(r.pos), online = n(r.online);
    const received = (cash + pos + online) || +(net + vat).toFixed(2);
    return [{
      id: ++_id,
      date,
      client: r.name || '',
      isNew: bool(r.cx),
      ref: '',
      pay: derivePayment(cash, pos, online),
      jlPortal: 0,
      booking: net,
      discount: 0,
      received,
      net,
      vat,
      drip: r.service_name || '',
      branch: 'home',
      branchName: 'Peptides',
      nurse: r.converted_by || '',
      commission: 0,
      partner: 0,
      dosage: '',
      source: 'peptides',
      location: r.location || '',
      contactNo: r.number || '',
      remarks: r.remarks || '',
      isNewLabel: bool(r.cx) ? 'New' : 'Existing',
      cashAmt: cash,
      posAmt: pos,
      onlineAmt: online,
      deliveryCharges: n(r.delivery_charges),
    }];
  });
}

export function mapDifc(rows: RawRow[]): SalesRow[] {
  return rows.flatMap(r => {
    const date = parseDate(r.date);
    if (!date) return [];
    const received = n(r.service_total_with_vat);
    const net = n(r.service_total_no_vat) || +(received / 1.05).toFixed(2);
    const vat = n(r.vat_5_percent) || +(received - net).toFixed(2);
    const cash = n(r.cash), pos = n(r.pos);
    const onlineVat = n(r.online_vat), onlineNoVat = n(r.online_no_vat);
    const posNoVat = n(r.pos_no_vat);
    const classpass = n(r.classpass), groupon = n(r.groupon);
    const online = onlineVat + onlineNoVat;
    return [{
      id: ++_id,
      date,
      client: r.name || '',
      isNew: bool(r.new_cx),
      ref: r.sl_no || '',
      pay: derivePayment(cash, pos + posNoVat, online, classpass, groupon),
      jlPortal: 0,
      booking: received,
      discount: 0,
      received,
      net,
      vat,
      drip: r.service_name || '',
      branch: 'difc',
      branchName: 'DIFC',
      nurse: r.provider || '',
      commission: 0,
      partner: 0,
      dosage: '',
      source: 'difc',
      remarks: r.remarks || '',
      upsell: n(r.upsell_amount),
      isNewLabel: bool(r.new_cx) ? 'New' : 'Existing',
      department: r.department || '',
      cashAmt: cash,
      posAmt: pos,
      onlineVat,
      posNoVat,
      classpassAmt: classpass,
      grouponAmt: groupon,
      onlineNoVat,
      therapistName: r.therapist || '',
      dailyRevenue: n(r.daily_revenue),
      sessionNo: r.session_no || '',
      prepaidDate: r.prepaid_date || '',
    }];
  });
}

export function mapPalm(rows: RawRow[]): SalesRow[] {
  return rows.flatMap(r => {
    const date = parseDate(r.date);
    if (!date) return [];
    const received = n(r.service_total_with_vat);
    const net = n(r.service_total_no_vat) || +(received / 1.05).toFixed(2);
    const vat = n(r.vat_5_percent) || +(received - net).toFixed(2);
    const cash = n(r.cash), pos = n(r.pos);
    const onlineVat = n(r.online_vat), onlineNoVat = n(r.online_no_vat);
    const posNoVat = n(r.pos_no_vat);
    const classpass = n(r.classpass), groupon = n(r.groupon);
    const online = onlineVat + onlineNoVat;
    return [{
      id: ++_id,
      date,
      client: r.name || '',
      isNew: bool(r.new_cx),
      ref: r.sl_no || '',
      pay: derivePayment(cash, pos + posNoVat, online, classpass, groupon),
      jlPortal: 0,
      booking: received,
      discount: 0,
      received,
      net,
      vat,
      drip: r.service_name || '',
      branch: 'palm',
      branchName: 'Palm Jumeirah',
      nurse: r.provider || r.employee_name || '',
      commission: 0,
      partner: 0,
      dosage: '',
      source: 'palm',
      remarks: r.remarks || '',
      upsell: n(r.upsell_amount),
      isNewLabel: bool(r.new_cx) ? 'New' : 'Existing',
      department: r.department || '',
      cashAmt: cash,
      posAmt: pos,
      onlineVat,
      posNoVat,
      classpassAmt: classpass,
      grouponAmt: groupon,
      onlineNoVat,
      therapistName: r.employee_name || '',
      dailyRevenue: n(r.daily_revenue),
      sessionNo: r.session_no || '',
      prepaidDate: r.prepaid_date || '',
      still: r.still || '',
      palmAmount: n(r.amount),
    }];
  });
}

export async function fetchRealRows(): Promise<SalesRow[]> {
  _id = 0;
  try {
    const res = await fetch('/api/data', { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success || !json.data) return [];
    const d = json.data;
    const rows = [
      ...mapJustlife(d.justlife ?? []),
      ...mapIvhome(d.ivhome ?? []),
      ...mapPeptides(d.peptides ?? []),
      ...mapDifc(d.difc ?? []),
      ...mapPalm(d.palm ?? []),
    ].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    return rows;
  } catch {
    return [];
  }
}
