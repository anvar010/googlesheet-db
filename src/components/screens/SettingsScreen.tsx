'use client';

import { Card, Badge } from '@/components/ds';
import { Icon } from '@/components/ds/Icon';

export function SettingsScreen() {
  const salesSheets = [
    ['Justlife', 'sheet_justlife'],
    ['IV Home',  'sheet_ivhome'],
    ['Peptides', 'sheet_peptides'],
    ['DIFC',     'sheet_difc'],
    ['Palm',     'sheet_palm'],
  ];

  const SheetCard = ({ name, desc, icon, iconBg, iconColor }: { name: string; desc: string; icon: string; iconBg: string; iconColor: string }) => (
    <Card pad={20} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={19} color={iconColor} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' }}>{name}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{desc}</div>
      </div>
      <Badge tone="positive" dot style={{ marginLeft: 'auto' }}>Live</Badge>
    </Card>
  );

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <div className="ds-eyebrow" style={{ marginBottom: 12 }}>Connected sheets · {salesSheets.length} tables</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
          {salesSheets.map(([n, d]) => <SheetCard key={n} name={n} desc={d} icon="table-2" iconBg="var(--positive-soft)" iconColor="var(--green-600)" />)}
        </div>
      </div>
    </div>
  );
}
