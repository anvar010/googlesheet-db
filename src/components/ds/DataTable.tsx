'use client';

export interface Column {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (row: any) => React.ReactNode;
  tnum?: boolean;
  nowrap?: boolean;
}

interface DataTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  stickyHeader?: boolean;
  zebra?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (row: any) => void;
  emptyText?: string;
  style?: React.CSSProperties;
}

export function DataTable({ columns, rows, stickyHeader = true, zebra = true, onRowClick, emptyText = 'No records', style }: DataTableProps) {
  return (
    <div style={{ width: '100%', overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', ...style }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', fontSize: 13.5 }}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} style={{
                position: stickyHeader ? 'sticky' : undefined, top: 0, zIndex: 1,
                textAlign: (c.align || 'left') as React.CSSProperties['textAlign'], padding: '11px 16px', background: 'var(--surface-sunken)',
                color: 'var(--text-faint)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap', width: c.width,
              }}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-faint)' }}>{emptyText}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={row.id ?? i} onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={{ background: zebra && i % 2 ? 'var(--ivory)' : 'var(--surface-card)', cursor: onRowClick ? 'pointer' : 'default', transition: 'background var(--dur-fast)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--green-50)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = zebra && i % 2 ? 'var(--ivory)' : 'var(--surface-card)'; }}>
              {columns.map(c => (
                <td key={c.key} style={{
                  textAlign: (c.align || 'left') as React.CSSProperties['textAlign'], padding: '12px 16px', color: 'var(--text-body)',
                  borderBottom: '1px solid var(--border-subtle)', fontVariantNumeric: c.tnum ? 'tabular-nums' : undefined,
                  fontWeight: c.tnum ? 600 : 400, whiteSpace: c.nowrap ? 'nowrap' : undefined,
                }}>{c.render ? c.render(row) : row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
