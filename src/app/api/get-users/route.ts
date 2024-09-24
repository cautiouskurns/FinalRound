import { NextResponse } from 'next/server';
const { initDatabase, getDb } = require('../../../database/init');

export async function GET() {
  await initDatabase();
  const db = getDb();
  
  try {
    const users = await db.all('SELECT * FROM users');
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch users', error: (error as Error).message },
      { status: 500 }
    );
  }
}
