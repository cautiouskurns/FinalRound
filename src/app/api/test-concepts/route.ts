import { NextResponse } from 'next/server';
import { getDb, initDb } from '../../../database/config';

export async function GET() {
  try {
    await initDb();
    const db = await getDb();
    const concepts = await db.all('SELECT * FROM concepts');
    return NextResponse.json(concepts);
  } catch (error) {
    console.error('Error fetching concepts:', error);
    return NextResponse.json({ error: 'Failed to fetch concepts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name, details } = await request.json();
  
  try {
    const stmt = db.prepare("INSERT INTO concepts (name, details) VALUES (?, ?)");
    const result = stmt.run(name, details);
    return NextResponse.json({ id: result.lastInsertRowid, name, details }, { status: 201 });
  } catch (err) {
    console.error("Error adding concept:", err);
    return NextResponse.json({ error: 'Failed to add concept' }, { status: 500 });
  }
}