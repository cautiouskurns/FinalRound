import { NextResponse } from 'next/server';
import { getDb } from '../../../database/config';

export async function POST(request: Request) {
  try {
    const { name, details, subject_id } = await request.json();
    const db = await getDb();
    
    const result = await db.run('INSERT INTO topics (name, details, subject_id) VALUES (?, ?, ?)', [name, details, subject_id]);
    
    return NextResponse.json({ id: result.lastID, name, details, subject_id }, { status: 201 });
  } catch (error) {
    console.error('Error adding topic:', error);
    return NextResponse.json({ error: 'Failed to add topic' }, { status: 500 });
  }
}