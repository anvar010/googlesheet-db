'use client';

import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { LoginScreen, type AppUser } from '@/components/screens/LoginScreen';
import { OverviewScreen } from '@/components/screens/OverviewScreen';
import { BranchesScreen } from '@/components/screens/BranchesScreen';
import { TransactionsScreen } from '@/components/screens/TransactionsScreen';
import { ReportBuilderScreen } from '@/components/screens/ReportBuilderScreen';
import { ClientsScreen } from '@/components/screens/ClientsScreen';
import { ExpensesScreen } from '@/components/screens/ExpensesScreen';
import { NursesScreen } from '@/components/screens/NursesScreen';
import { SettingsScreen } from '@/components/screens/SettingsScreen';
import type { DateRange } from '@/components/ds/DateFilter';
import type { SalesRow } from '@/lib/data';
import { ROWS as EXPENSE_ROWS } from '@/lib/expenseData';
import { fetchRealRows } from '@/lib/dbData';

const TITLES: Record<string, [string, string]> = {
  overview: ['Sales overview', 'All branches consolidated · live from Google Sheets'],
  branches: ['Branch comparison', 'Palm Jumeirah · DIFC · IV Home'],
  transactions: ['Transactions', 'Every sale across the connected sheets'],
  report: ['Report builder', 'Compose & export the daily sales report'],
  clients: ['Clients', 'Client directory · new vs returning · visit history'],
  expenses: ['Expenses', 'DIFC & Palm branch expenses · every category & detail'],
  nurses: ['Staff performance', 'Employee-wise sales roll-up'],
  settings: ['Sheet connections', '7 live Google Sheet tabs · sales + expenses'],
};

export default function Page() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [route, setRoute] = useState('overview');
  const [vat, setVat] = useState('incl');
  const [hydrated, setHydrated] = useState(false);
  const [salesRows, setSalesRows] = useState<SalesRow[]>([]);

  useEffect(() => {
    fetchRealRows().then(rows => { setSalesRows(rows); });
  }, []);

  const salesBounds = useMemo(() => {
    const dates = salesRows.map(r => r.date).filter(Boolean).sort();
    return { from: dates[0] ?? '', to: dates[dates.length - 1] ?? '' };
  }, [salesRows]);

  const expenseBounds = useMemo(() => {
    const dates = EXPENSE_ROWS.map(r => r.date).sort();
    return { from: dates[0], to: dates[dates.length - 1] };
  }, []);

  const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '', label: 'All' });

  useEffect(() => {
    const bounds = route === 'expenses' ? expenseBounds : salesBounds;
    setDateRange({ from: bounds.from, to: bounds.to, label: 'All' });
  }, [route, salesBounds, expenseBounds]);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem('ivhub_user');
      if (s) setUser(JSON.parse(s));
    } catch { /* noop */ }
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const handleLogin = (u: AppUser) => {
    sessionStorage.setItem('ivhub_user', JSON.stringify(u));
    setUser(u);
  };
  const handleLogout = () => {
    sessionStorage.removeItem('ivhub_user');
    setUser(null);
  };

  if (!user) return <div style={{ position: 'fixed', inset: 0, zIndex: 9999, width: '100vw', height: '100vh' }}><LoginScreen onLogin={handleLogin} /></div>;

  const [title, sub] = TITLES[route] || TITLES.overview;
  const showVat = route !== 'report' && route !== 'settings';
  const currentBounds = route === 'expenses' ? expenseBounds : salesBounds;

  let screen;
  if (route === 'overview') screen = <OverviewScreen vat={vat} onNav={setRoute} dateRange={dateRange} dbRows={salesRows} />;
  else if (route === 'branches') screen = <BranchesScreen vat={vat} dateRange={dateRange} dbRows={salesRows} />;
  else if (route === 'transactions') screen = <TransactionsScreen vat={vat} dateRange={dateRange} dbRows={salesRows} />;
  else if (route === 'report') screen = <ReportBuilderScreen vat={vat} onVat={setVat} dateRange={dateRange} dbRows={salesRows} />;
  else if (route === 'clients') screen = <ClientsScreen vat={vat} dateRange={dateRange} dbRows={salesRows} />;
  else if (route === 'expenses') screen = <ExpensesScreen dateRange={dateRange} />;
  else if (route === 'nurses') screen = <NursesScreen vat={vat} dateRange={dateRange} dbRows={salesRows} />;
  else screen = <SettingsScreen />;

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar active={route} onNav={setRoute} user={user} onLogout={handleLogout} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar title={title} subtitle={sub} vat={vat} onVat={setVat} dateRange={dateRange} onDateRange={setDateRange} dataFrom={currentBounds.from} dataTo={currentBounds.to} onExport={() => setRoute('report')} showVat={showVat} />
        <div style={{ flex: 1 }}>{screen}</div>
      </div>
    </div>
  );
}
