import { NextResponse } from 'next/server';
import { initDatabase } from '../../../database/init';

export async function GET() {
  try {
    await initDatabase();
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}