import { NextResponse } from 'next/server';
import { getDb } from '../../../database/config';

export async function GET() {
  try {
    const db = await getDb();
    const topics = await db.all('SELECT * FROM topics');
    return NextResponse.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, details } = await request.json();
    const db = await getDb();
    
    const result = await db.run('INSERT INTO topics (name, details) VALUES (?, ?)', [name, details]);
    
    return NextResponse.json({ id: result.lastID, name, details }, { status: 201 });
  } catch (error) {
    console.error('Error adding topic:', error);
    return NextResponse.json({ error: 'Failed to add topic' }, { status: 500 });
  }
}