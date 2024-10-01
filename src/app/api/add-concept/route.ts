import { NextResponse } from 'next/server';
import { getDb } from '../../../database/config';

export async function POST(request: Request) {
  try {
    const { name, details } = await request.json();
    const db = await getDb();
    
    await db.run('INSERT INTO concepts (name, details) VALUES (?, ?)', [name, details]);
    
    return NextResponse.json({ message: 'Concept added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding concept:', error);
    return NextResponse.json({ error: 'Failed to add concept' }, { status: 500 });
  }
}