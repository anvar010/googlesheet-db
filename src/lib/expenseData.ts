// ─── Expense Data Module ──────────────────────────────────────
// Converted from window.EXPENSE_DATA IIFE to ES module exports.
// Deterministic PRNG seeded with 20260601 — produces identical rows every load.

// ─── Types ────────────────────────────────────────────────────

export interface ExpenseCategory {
  key: string;
  name: string;
  icon: string;
}

export interface ExpenseRow {
  id: number;
  date: string;
  category: string;
  categoryName: string;
  categoryIcon: string;
  particular: string;
  branch: string;
  branchName: string;
  amount: number;
  type: string;
  status: string;
  paidBy: string;
  approved: boolean;
  notes: string;
}

export interface ExpenseTotals {
  total: number;
  opex: number;
  capex: number;
  paid: number;
  pending: number;
  count: number;
}

// ─── Constants ────────────────────────────────────────────────

export const CATEGORIES: ExpenseCategory[] = [
  { key: 'medical-supplies', name: 'Medical Supplies', icon: 'pill' },
  { key: 'car-fuel', name: 'Car & Fuel', icon: 'fuel' },
  { key: 'lounge', name: 'Lounge & Furniture', icon: 'sofa' },
  { key: 'marketing', name: 'Marketing & Ads', icon: 'megaphone' },
  { key: 'staff', name: 'Staff & HR', icon: 'users' },
  { key: 'rent', name: 'Rent & Lease', icon: 'building-2' },
  { key: 'utilities', name: 'Utilities', icon: 'zap' },
  { key: 'machines', name: 'Machines & Equipment', icon: 'cog' },
  { key: 'it-software', name: 'IT & Software', icon: 'monitor' },
  { key: 'maintenance', name: 'Maintenance', icon: 'wrench' },
  { key: 'insurance', name: 'Insurance', icon: 'shield' },
  { key: 'misc', name: 'Miscellaneous', icon: 'package' },
  { key: 'consumables', name: 'Consumables', icon: 'droplets' },
  { key: 'legal', name: 'Legal & Compliance', icon: 'file-check' },
];

export const TYPES: string[] = ['OpEx', 'CapEx'];
export const STATUSES: string[] = ['PAID', 'PENDING', 'APPROVED'];
export const PAID_BY: string[] = ['Account', 'Ankush', 'Petty Cash', 'Card', 'Mayank', 'Bank Transfer'];

export const BRANCHES = [
  { key: 'difc', name: 'DIFC', color: 'var(--branch-difc)', soft: 'var(--branch-difc-soft)' },
  { key: 'palm', name: 'Palm Jumeirah', color: 'var(--branch-palm)', soft: 'var(--branch-palm-soft)' },
];

const AMOUNT_RANGES: Record<string, [number, number]> = {
  'medical-supplies': [200, 8000],
  'car-fuel': [50, 500],
  'lounge': [30, 800],
  'marketing': [500, 15000],
  'staff': [200, 5000],
  'rent': [15000, 45000],
  'utilities': [300, 4000],
  'machines': [1000, 55000],
  'it-software': [100, 2500],
  'maintenance': [150, 3500],
  'insurance': [2000, 12000],
  'misc': [20, 1500],
  'consumables': [50, 1200],
  'legal': [500, 8000],
};

const PARTICULARS: Record<string, string[]> = {
  'medical-supplies': [
    'IV cannulas (box of 100)', 'Normal saline 0.9% (case)', 'Vitamin C ampoules',
    'Glutathione vials', 'B-complex injections', 'NAD+ powder (10g)',
    'Biotin ampoules', 'Zinc sulphate vials', 'Magnesium chloride solution',
    'Anti-nausea medication', 'Sterile gloves (case)', 'Alcohol swabs (bulk)',
    'IV tubing sets', 'Tourniquet bands', 'Sharps containers',
    'Saline flush syringes', 'Dressing packs', 'Electrolyte concentrate',
  ],
  'car-fuel': [
    'Fuel top-up — IV Home van', 'Salik recharge', 'Parking — Mall of Emirates',
    'Fuel — delivery vehicle', 'Parking — DIFC Gate', 'Salik tag replacement',
    'Fuel — nurse transport', 'Valet parking — client visit', 'Fuel — supply run',
  ],
  'lounge': [
    'Cushion covers (set of 6)', 'Diffuser oil refill — lavender', 'LED panel replacement',
    'Reception flowers — weekly', 'Scented candles (bulk)', 'Throw blankets (x4)',
    'Wall art print — wellness', 'Magazine subscriptions', 'Waiting area rug',
    'Privacy curtain replacement', 'Ambient speaker system', 'Plant maintenance — monthly',
  ],
  'marketing': [
    'Instagram ads — June campaign', 'Google Ads — IV drip keywords', 'Influencer collaboration — wellness',
    'Brochure printing (500 pcs)', 'Business cards reprint', 'Photography session — clinic',
    'Video production — reels', 'SEO retainer — monthly', 'Email marketing platform',
    'Billboard — Sheikh Zayed Rd', 'Loyalty cards printing', 'PR agency retainer',
    'TikTok ads — summer promo', 'Flyer distribution — JBR',
  ],
  'staff': [
    'Nurse uniforms (x6)', 'Staff lunch allowance', 'Training workshop — IV techniques',
    'First aid certification', 'Team building event', 'Recruitment agency fee',
    'Staff transport allowance', 'Overtime payment — weekend', 'Annual bonus provision',
    'HR software subscription', 'Employee insurance top-up', 'Staff appreciation gifts',
  ],
  'rent': [
    'Monthly rent — DIFC clinic', 'Monthly rent — Palm branch', 'Security deposit top-up',
    'Rent escalation adjustment', 'Common area maintenance fee', 'Parking bay rental — DIFC',
  ],
  'utilities': [
    'DEWA bill — DIFC', 'DEWA bill — Palm', 'Internet — du Business',
    'Chiller fee — DIFC', 'Water delivery — 5-gallon (x20)', 'Waste disposal service',
    'Internet upgrade — fiber', 'Phone line — reception',
  ],
  'machines': [
    'IV infusion pump (x2)', 'Pulse oximeter (x4)', 'Blood pressure monitor — digital',
    'Mini fridge — vaccine storage', 'Autoclave steriliser', 'Portable UV sanitiser',
    'Body composition analyser', 'Cryo chamber maintenance unit', 'LED light therapy panel',
    'Hyperbaric oxygen unit deposit', 'Nebuliser machine',
  ],
  'it-software': [
    'Clinic management software — monthly', 'POS system licence', 'Booking platform subscription',
    'Cloud storage — Google Workspace', 'Accounting software — Zoho', 'Website hosting — annual',
    'SSL certificate renewal', 'iPad for reception (x2)', 'Barcode scanner',
    'CRM subscription — HubSpot', 'WhatsApp Business API', 'Cybersecurity suite',
  ],
  'maintenance': [
    'AC servicing — DIFC', 'Plumbing repair — Palm', 'Deep cleaning service',
    'Pest control — quarterly', 'Fire extinguisher inspection', 'Elevator maintenance',
    'Window cleaning — external', 'Electrical panel check', 'Paint touch-up — reception',
    'Door lock replacement', 'Ceiling light fix', 'Signage repair — exterior',
  ],
  'insurance': [
    'Clinic liability insurance — annual', 'Equipment insurance renewal',
    'Professional indemnity — nurses', 'Vehicle insurance — IV Home van',
    'Fire & theft coverage', 'Business interruption policy',
  ],
  'misc': [
    'Courier service — lab samples', 'Stationery supplies', 'Postage & shipping',
    'Tea & coffee supplies', 'Hand sanitiser (bulk)', 'Tissue boxes (case)',
    'Bin liners (bulk)', 'Battery replacement — devices', 'USB drives (x10)',
    'Extension cords (x3)', 'Name badges — new staff',
  ],
  'consumables': [
    'Cotton rolls (bulk)', 'Micropore tape (box)', 'Face masks (case of 50)',
    'Disposable caps (pack)', 'Shoe covers (case)', 'Paper bed rolls',
    'Antiseptic solution', 'Hand wash refill (x6)', 'Surface disinfectant spray',
    'Tongue depressors (box)', 'Urine sample cups',
  ],
  'legal': [
    'Trade licence renewal — DHA', 'Legal consultation — contract review',
    'DHA inspection fee', 'Medical waste licence', 'Labour contract drafting',
    'Trademark registration', 'Data protection compliance audit',
    'NOC processing fee', 'Corporate tax advisory',
  ],
};

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

export function totals(rows: ExpenseRow[]): ExpenseTotals {
  const total = sum(rows, 'amount');
  const opex = sum(rows.filter(r => r.type === 'OpEx'), 'amount');
  const capex = sum(rows.filter(r => r.type === 'CapEx'), 'amount');
  const paid = sum(rows.filter(r => r.status === 'PAID'), 'amount');
  const pending = sum(rows.filter(r => r.status === 'PENDING'), 'amount');
  return { total, opex, capex, paid, pending, count: rows.length };
}

export function groupBy(
  rows: ExpenseRow[],
  key: keyof ExpenseRow | ((r: ExpenseRow) => string),
): Record<string, ExpenseRow[]> {
  const map: Record<string, ExpenseRow[]> = {};
  for (const r of rows) {
    const k = typeof key === 'function' ? key(r) : String(r[key]);
    if (!map[k]) map[k] = [];
    map[k].push(r);
  }
  return map;
}

export function daily(rows: ExpenseRow[]): { date: string; value: number }[] {
  const map: Record<string, number> = {};
  for (const r of rows) {
    map[r.date] = (map[r.date] || 0) + r.amount;
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

function generateRows(): ExpenseRow[] {
  const rng = mulberry32(20260601);
  const startDate = new Date('2026-06-01T00:00:00');
  const rows: ExpenseRow[] = [];

  for (let i = 0; i < 180; i++) {
    const dayOffset = Math.floor(rng() * 30);
    const d = new Date(startDate);
    d.setDate(d.getDate() + dayOffset);
    const date = d.toISOString().slice(0, 10);

    const catObj = pick(CATEGORIES, rng);
    const category = catObj.key;
    const categoryName = catObj.name;

    const branchObj = pick(BRANCHES, rng);
    const branch = branchObj.key;
    const branchName = branchObj.name;

    const range = AMOUNT_RANGES[category];
    const amount = randBetween(range[0], range[1], rng);

    // Type logic: machines and rent are always CapEx, it-software > 1500 is CapEx, else OpEx
    let type: string;
    if (category === 'machines' || category === 'rent') {
      type = 'CapEx';
    } else if (category === 'it-software' && amount > 1500) {
      type = 'CapEx';
    } else {
      type = 'OpEx';
    }

    // Status: 70% PAID, then 60% APPROVED else PENDING
    let status: string;
    if (rng() < 0.7) {
      status = 'PAID';
    } else {
      status = rng() < 0.6 ? 'APPROVED' : 'PENDING';
    }

    const paidBy = pick(PAID_BY, rng);

    const particulars = PARTICULARS[category];
    const particular = pick(particulars, rng);

    const notes = '';

    const catDef = CATEGORIES.find(c => c.key === category);
    rows.push({
      id: i + 1,
      date,
      category,
      categoryName,
      categoryIcon: catDef?.icon || 'package',
      particular,
      branch,
      branchName,
      amount,
      type,
      status,
      paidBy,
      approved: status === 'PAID' || status === 'APPROVED',
      notes,
    });
  }

  // Sort newest first
  rows.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : b.id - a.id));
  return rows;
}

// ─── Exported Rows ────────────────────────────────────────────

export const ROWS: ExpenseRow[] = generateRows();
