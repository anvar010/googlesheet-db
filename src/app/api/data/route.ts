import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Production: direct DB connection
    if (process.env.DB_HOST) {
      const mysql = await import('mysql2/promise');
      const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
      });
      const tables = ['justlife', 'ivhome', 'peptides', 'difc', 'palm'];
      const data: Record<string, unknown[]> = {};
      for (const t of tables) {
        const [rows] = await conn.execute(`SELECT * FROM \`sheet_${t}\` ORDER BY id ASC`);
        data[t] = rows as unknown[];
      }
      await conn.end();
      return NextResponse.json({ success: true, data });
    }

    // Development: via read_api.php
    const url = `${process.env.READ_API_URL}?key=${process.env.READ_API_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
