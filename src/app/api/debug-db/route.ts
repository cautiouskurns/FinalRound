import { NextResponse } from 'next/server';
import { initDatabase, getDb } from '../../../database/init';

export async function GET() {
  try {
    await initDatabase();
    const db = await getDb();
    
    const subjects = await db.all('SELECT * FROM subjects');
    const topics = await db.all('SELECT * FROM topics');
    const concepts = await db.all('SELECT * FROM concepts');
    const questions = await db.all('SELECT * FROM questions');

    return NextResponse.json({ subjects, topics, concepts, questions });
  } catch (error) {
    console.error('Error fetching debug data:', error);
    return NextResponse.json({ error: 'Failed to fetch debug data' }, { status: 500 });
  }
}