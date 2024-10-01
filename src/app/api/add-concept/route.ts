import { NextResponse } from 'next/server';
import { getDb } from '../../../database/config';

export async function POST(request: Request) {
  try {
    const { name, details, topic_id } = await request.json();
    const db = await getDb();
    
    const result = await db.run('INSERT INTO concepts (name, details, topic_id) VALUES (?, ?, ?)', [name, details, topic_id]);
    
    return NextResponse.json({ id: result.lastID, name, details, topic_id }, { status: 201 });
  } catch (error) {
    console.error('Error adding concept:', error);
    return NextResponse.json({ error: 'Failed to add concept' }, { status: 500 });
  }
}