'use client';

import { Icon } from '@/components/ds/Icon';

interface User {
  name: string;
  role: string;
}

interface SidebarProps {
  active: string;
  onNav: (key: string) => void;
  user?: User | null;
  onLogout?: () => void;
}

const items = [
  { key: 'overview', label: 'Overview', icon: 'layout-dashboard' },
  { key: 'branches', label: 'Branches', icon: 'git-fork' },
  { key: 'transactions', label: 'Transactions', icon: 'table-2' },
  { key: 'report', label: 'Report builder', icon: 'file-down' },
  { key: 'clients', label: 'Clients', icon: 'contact' },
];

const secondary = [
  { key: 'expenses', label: 'Expenses', icon: 'wallet-cards' },
  { key: 'nurses', label: 'Staff performance', icon: 'users' },
  { key: 'settings', label: 'Sheet connections', icon: 'plug' },
];

function Item({ it, active, onNav }: { it: typeof items[0]; active: boolean; onNav: (key: string) => void }) {
  return (
    <button
      onClick={() => onNav(it.key)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%', height: 44,
        padding: '0 14px', border: 'none', cursor: 'pointer', textAlign: 'left',
        borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 14,
        fontWeight: active ? 700 : 500,
        background: active ? 'rgba(194,161,91,0.16)' : 'transparent',
        color: active ? 'var(--ivory)' : 'var(--text-on-dark-muted)',
        transition: 'background var(--dur-fast), color var(--dur-fast)',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(251,249,244,0.06)'; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <Icon name={it.icon} size={18} color={active ? 'var(--gold-400)' : 'currentColor'} />
      {it.label}
      {active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--gold-400)' }} />}
    </button>
  );
}

export function Sidebar({ active, onNav, user, onLogout }: SidebarProps) {
  return (
    <aside style={{
      width: 'var(--sidebar-w)', flex: 'none', background: 'var(--surface-inverse)',
      borderRight: '1px solid var(--border-on-dark)', display: 'flex', flexDirection: 'column',
      padding: '20px 14px', position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 22px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://ivhub.com/assets/img/logo/logo_white.png" alt="IV Hub" style={{ height: 30, objectFit: 'contain' }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; const next = e.currentTarget.nextSibling as HTMLElement; if (next) next.style.display = 'flex'; }} />
        <span style={{ display: 'none', alignItems: 'center', gap: 8, fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, color: 'var(--ivory)' }}>
          IV&nbsp;<span style={{ color: 'var(--gold-400)' }}>Hub</span>
        </span>
      </div>
      <div className="ds-eyebrow" style={{ color: 'var(--text-on-dark-muted)', padding: '0 8px 8px' }}>Sales</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map(it => <Item key={it.key} it={it} active={active === it.key} onNav={onNav} />)}
      </nav>
      <div className="ds-eyebrow" style={{ color: 'var(--text-on-dark-muted)', padding: '20px 8px 8px' }}>More</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {secondary.map(it => <Item key={it.key} it={it} active={active === it.key} onNav={onNav} />)}
      </nav>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--surface-inverse-soft)', border: '1px solid var(--border-on-dark)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green-300)', boxShadow: '0 0 0 3px rgba(134,190,176,0.25)' }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ivory)' }}>Sheets connected</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-on-dark-muted)', lineHeight: 1.5 }}>7 live tabs · synced 2 min ago</div>
        </div>
        {user && (
          <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--surface-inverse-soft)', border: '1px solid var(--border-on-dark)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--gold-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--surface-inverse)', flexShrink: 0 }}>
              {user.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ivory)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-on-dark-muted)' }}>{user.role}</div>
            </div>
            <button onClick={onLogout} title="Sign out" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-on-dark-muted)', borderRadius: 'var(--radius-sm)', transition: 'color 150ms' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--ivory)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-on-dark-muted)'}>
              <Icon name="log-out" size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
