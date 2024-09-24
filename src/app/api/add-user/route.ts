import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb } from '../../../database/init';

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();

    const { name, email } = await request.json();

    const result = await db.run(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );

    return NextResponse.json({ message: 'User added successfully', userId: result.lastID });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json(
      { message: 'Failed to add user', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}