import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb } from '../../../database/init';

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const db = getDb();

    const users = await request.json();

    const insertPromises = users.map((user: { name: string; email: string }) =>
      db.run('INSERT INTO users (name, email) VALUES (?, ?)', [user.name, user.email])
    );

    await Promise.all(insertPromises);

    return NextResponse.json({ message: 'Users added successfully' });
  } catch (error) {
    console.error('Error adding users:', error);
    return NextResponse.json(
      { message: 'Failed to add users', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}