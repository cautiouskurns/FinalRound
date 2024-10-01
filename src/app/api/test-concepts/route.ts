import { NextResponse } from 'next/server';
import { getDb, initDb } from '../../../database/config';

export async function GET(request: Request) {
  try {
    await initDb();
    const db = await getDb();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'subjects') {
      const subjects = await db.all('SELECT * FROM subjects');
      return NextResponse.json(subjects);
    } else if (type === 'topics') {
      const topics = await db.all(`
        SELECT t.*, s.name as subject_name 
        FROM topics t
        LEFT JOIN subjects s ON t.subject_id = s.id
      `);
      return NextResponse.json(topics);
    } else {
      const concepts = await db.all(`
        SELECT c.*, t.name as topic_name, s.name as subject_name
        FROM concepts c
        LEFT JOIN topics t ON c.topic_id = t.id
        LEFT JOIN subjects s ON t.subject_id = s.id
      `);
      return NextResponse.json(concepts);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name, details } = await request.json();
  
  try {
    const stmt = db.prepare("INSERT INTO concepts (name, details) VALUES (?, ?)");
    const result = stmt.run(name, details);
    return NextResponse.json({ id: result.lastInsertRowid, name, details }, { status: 201 });
  } catch (err) {
    console.error("Error adding concept:", err);
    return NextResponse.json({ error: 'Failed to add concept' }, { status: 500 });
  }
}