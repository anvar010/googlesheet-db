'use client';

import { Card } from './Card';
import { Icon } from './Icon';

interface StatCardProps {
  label: string;
  value: string | number;
  currency?: string;
  net?: string | number;
  vat?: string | number;
  delta?: string | number;
  deltaDir?: 'up' | 'down' | 'flat';
  accent?: string;
  icon?: string;
  onClick?: () => void;
  hint?: string;
  style?: React.CSSProperties;
}

export function StatCard({ label, value, currency = 'AED', net, vat, delta, deltaDir, accent = 'brand', icon, onClick, hint, style }: StatCardProps) {
  const accentColor = accent === 'gold' ? 'var(--gold-600)' : accent === 'negative' ? 'var(--negative)' : 'var(--green-600)';
  return (
    <Card pad={20} style={{ cursor: onClick ? 'pointer' : undefined, position: 'relative', ...style }} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span className="ds-eyebrow">{label}</span>
        {icon && <Icon name={icon} size={18} color="var(--text-faint)" style={{ opacity: 0.6 }} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {currency && <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-faint)', marginRight: 2 }}>{currency}</span>}
        <span className="ds-display" style={{ fontSize: 'var(--text-h2)' }}>{value}</span>
      </div>
      {delta !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 12.5, fontWeight: 600, color: deltaDir === 'down' ? 'var(--negative)' : accentColor }}>
          <Icon name={deltaDir === 'down' ? 'arrow-down-right' : deltaDir === 'up' ? 'arrow-up-right' : 'activity'} size={14} />
          {delta}
        </div>
      )}
      {(net || vat) && (
        <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          {net && <span>Net <span className="ds-num" style={{ fontWeight: 600 }}>{net}</span></span>}
          {vat && <span>VAT <span className="ds-num" style={{ fontWeight: 600 }}>{vat}</span></span>}
        </div>
      )}
      {hint && <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 6 }}>{hint}</div>}
    </Card>
  );
}
