import { NextResponse } from 'next/server';
import { getDb, initDb } from '../../../database/config';

export async function GET(request: Request) {
  try {
    await initDb();
    const db = await getDb();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'topics') {
      const topics = await db.all('SELECT * FROM topics');
      return NextResponse.json(topics);
    } else {
      // Existing code for fetching concepts
      const columns = await db.all("PRAGMA table_info(concepts)");
      const topicIdExists = columns.some(col => col.name === 'topic_id');

      let concepts;
      if (topicIdExists) {
        concepts = await db.all(`
          SELECT c.*, t.name as topic_name 
          FROM concepts c
          LEFT JOIN topics t ON c.topic_id = t.id
        `);
      } else {
        concepts = await db.all('SELECT * FROM concepts');
      }

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