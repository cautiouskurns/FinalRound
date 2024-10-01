import { NextResponse } from 'next/server';
import { getDb } from '../../../database/config';

export async function POST(request: Request) {
  try {
    const { name, subject_id } = await request.json();
    const db = await getDb();
    
    await db.run('INSERT INTO topics (name, subject_id) VALUES (?, ?)', [name, subject_id]);
    
    return NextResponse.json({ message: 'Topic added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding topic:', error);
    return NextResponse.json({ error: 'Failed to add topic' }, { status: 500 });
  }
}