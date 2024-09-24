import { NextResponse } from 'next/server';
const { initDatabase, getDb } = require('../../../database/init');

export async function GET() {
  await initDatabase();
  try { 
    const db = getDb();
    const result = await db.all('SELECT * FROM users');
    return NextResponse.json({ message: 'Database test successful', result });
  } catch (error) {
    return NextResponse.json(
      { message: 'Database test failed', error: (error as Error).message },
      { status: 500 }
    );
  }
}