// ─── Sales Data Module ────────────────────────────────────────
// Converted from window.IVDATA IIFE to ES module exports.
// Deterministic PRNG seeded with 20250601 — produces identical rows every load.

// ─── Types ────────────────────────────────────────────────────

export interface Branch {
  key: string;
  name: string;
  color: string;
  soft: string;
}

export interface Payment {
  key: string;
  color: string;
}

export interface SalesRow {
  id: number;
  date: string;
  client: string;
  isNew: boolean;
  ref: string;
  pay: string;
  jlPortal: number;
  booking: number;
  discount: number;
  received: number;
  net: number;
  vat: number;
  drip: string;
  branch: string;
  branchName: string;
  nurse: string;
  commission: number;
  partner: number;
  dosage: string;
  source?: string;
  location?: string;
  contactNo?: string;
  remarks?: string;
  upsell?: number;
  isNewLabel?: string;
  cashAmt?: number;
  posAmt?: number;
  onlineAmt?: number;
  still?: string;
  palmAmount?: number;
  deliveryCharges?: number;
  onlineVat?: number;
  posNoVat?: number;
  classpassAmt?: number;
  grouponAmt?: number;
  onlineNoVat?: number;
  department?: string;
  therapistName?: string;
  dailyRevenue?: number;
  sessionNo?: string;
  prepaidDate?: string;
}

export interface Totals {
  booking: number;
  discount: number;
  received: number;
  net: number;
  vat: number;
  commission: number;
  partner: number;
  jlPortal: number;
  count: number;
}

// ─── Constants ────────────────────────────────────────────────

export const VAT_RATE = 0.05;

export const BRANCHES: Branch[] = [
  { key: 'difc', name: 'DIFC', color: 'var(--branch-difc)', soft: 'var(--branch-difc-soft)' },
  { key: 'palm', name: 'Palm Jumeirah', color: 'var(--branch-palm)', soft: 'var(--branch-palm-soft)' },
  { key: 'home', name: 'IV Home', color: 'var(--branch-home)', soft: 'var(--branch-home-soft)' },
];

export const PAYMENTS: Payment[] = [
  { key: 'Justlife', color: 'var(--pay-justlife)' },
  { key: 'Cash', color: 'var(--pay-cash)' },
  { key: 'Card', color: 'var(--pay-card)' },
  { key: 'Transfer', color: 'var(--pay-transfer)' },
  { key: 'Link', color: 'var(--pay-link)' },
  { key: 'Tabby', color: 'var(--pay-tabby)' },
];

export const DRIPS: string[] = [
  'Hydration Hub', 'Beauty Hub', 'Recovery Hub', 'Cleanse Hub',
  'Post Party Hub', 'Immunity Hub', 'Energy Hub', 'Glow Hub',
  'NAD+ Hub', 'Slim Hub', 'Post Party Hub + Cleanse Hub',
];

export const NURSES: string[] = [
  'Jaliska', 'Sumi', 'Rhea', 'Mariam', 'Anjali', 'Grace',
];

const CLIENTS: string[] = [
  'A. Khan', 'M. Said', 'R. Noor', 'S. Patel', 'L. Haddad',
  'F. Mansour', 'D. Roy', 'N. Ali', 'K. Suzuki', 'O. Ivanov',
  'P. Costa', 'T. Nguyen', 'H. Farooq', 'B. Cohen', 'E. Silva',
  'J. Abadi', 'C. Wright', 'Z. Malik', 'V. Romano', 'G. Petrov',
];

const DOSAGES: string[] = ['500ml', '1000ml', '250ml'];
const DISCOUNT_OPTIONS: number[] = [0, 0, 5, 10, 10, 15, 20];

// ─── Helpers ──────────────────────────────────────────────────

export function sum<T>(arr: T[], fn: ((r: T) => number) | keyof T): number {
  if (typeof fn === 'function') return arr.reduce((a, r) => a + ((fn as (r: T) => number)(r) || 0), 0);
  return arr.reduce((a, r) => a + (Number(r[fn as keyof T]) || 0), 0);
}

export function fmt(n: number, dp?: number): string {
  return n.toLocaleString('en-AE', { minimumFractionDigits: dp ?? 0, maximumFractionDigits: dp ?? 0 });
}

export function aed(n: number, dp?: number): string {
  const d = dp ?? 0;
  return 'AED ' + n.toLocaleString('en-AE', { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function fmtDate(d: string): string {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function totals(rows: SalesRow[]): Totals {
  return {
    booking: sum(rows, 'booking'),
    discount: sum(rows, 'discount'),
    received: sum(rows, 'received'),
    net: sum(rows, 'net'),
    vat: sum(rows, 'vat'),
    commission: sum(rows, 'commission'),
    partner: sum(rows, 'partner'),
    jlPortal: sum(rows, 'jlPortal'),
    count: rows.length,
  };
}

export function groupBy(
  rows: SalesRow[],
  key: keyof SalesRow | ((r: SalesRow) => string),
): Record<string, SalesRow[]> {
  const map: Record<string, SalesRow[]> = {};
  for (const r of rows) {
    const k = typeof key === 'function' ? key(r) : String(r[key]);
    if (!map[k]) map[k] = [];
    map[k].push(r);
  }
  return map;
}

export function daily(rows: SalesRow[]): { date: string; value: number }[] {
  const map: Record<string, number> = {};
  for (const r of rows) {
    map[r.date] = (map[r.date] || 0) + r.received;
  }
  return Object.keys(map)
    .sort()
    .map((d) => ({ date: d, value: map[d] }));
}

// ─── Deterministic PRNG ───────────────────────────────────────

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randBetween(min: number, max: number, rng: () => number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

// ─── Row Generation ───────────────────────────────────────────

function generateRows(): SalesRow[] {
  const rng = mulberry32(20250601);
  const startDate = new Date('2025-06-01T00:00:00');
  const rows: SalesRow[] = [];

  for (let i = 0; i < 420; i++) {
    const seed = Math.floor(rng() * 100000);
    const dayOffset = Math.floor(rng() * 30);
    const d = new Date(startDate);
    d.setDate(d.getDate() + dayOffset);
    const date = d.toISOString().slice(0, 10);

    const client = pick(CLIENTS, rng);
    const isNewRoll = (seed * 7 + i) % 100;
    const isNew = isNewRoll < 28;
    const ref = 'IV-' + (10428 + i);

    const payObj = pick(PAYMENTS, rng);
    const pay = payObj.key;

    const booking = Math.round((600 + Math.floor(rng() * 2001)) / 5) * 5;

    const hasDiscount = rng() < 0.45;
    const discount = hasDiscount ? pick(DISCOUNT_OPTIONS, rng) : 0;
    const received = booking - discount;

    // Justlife portal amount
    const jlPortal = pay === 'Justlife' ? Math.round(received * (0.15 + rng() * 0.1) * 100) / 100 : 0;

    const net = +(received / (1 + VAT_RATE)).toFixed(2);
    const vat = +(received - net).toFixed(2);

    const drip = pick(DRIPS, rng);
    const branchObj = pick(BRANCHES, rng);
    const branch = branchObj.key;
    const branchName = branchObj.name;
    const nurse = pick(NURSES, rng);

    const commPct = 8 + Math.floor(rng() * 9); // 8-16%
    const commission = +(net * commPct / 100).toFixed(2);

    // Partner settlement: Justlife gets portal amount; others zero
    const partner = pay === 'Justlife' ? jlPortal : 0;

    const dosage = pick(DOSAGES, rng);

    rows.push({
      id: i + 1,
      date,
      client,
      isNew,
      ref,
      pay,
      jlPortal,
      booking,
      discount,
      received,
      net,
      vat,
      drip,
      branch,
      branchName,
      nurse,
      commission,
      partner,
      dosage,
    });
  }

  // Sort newest first
  rows.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : b.id - a.id));
  return rows;
}

// ─── Exported Rows ────────────────────────────────────────────

export const ROWS: SalesRow[] = generateRows();
