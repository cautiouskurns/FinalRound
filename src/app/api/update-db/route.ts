import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDatabase } from '../../../database/init';
import syllabusData from '../../../../public/data/syllabus_enhanced.json';

async function updateDatabase() {
  // Initialize the database if it hasn't been done yet
  await initDatabase();
  
  const db = await getDb();

  // Clear existing data
  await db.run('DELETE FROM concepts');
  await db.run('DELETE FROM topics');
  await db.run('DELETE FROM subjects');

  // Re-populate with fresh data
  for (const subject of syllabusData) {
    const { lastID: subjectId } = await db.run('INSERT OR IGNORE INTO subjects (name) VALUES (?)', subject.name);
    for (const topic of subject.topics) {
      const { lastID: topicId } = await db.run('INSERT INTO topics (name, subject_id) VALUES (?, ?)', topic.name, subjectId);
      for (const concept of topic.concepts) {
        await db.run(
          'INSERT INTO concepts (name, details, code_example, topic_id) VALUES (?, ?, ?, ?)',
          concept.name,
          concept.details,
          concept.codeExample,
          topicId
        );
      }
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    await updateDatabase();
    return NextResponse.json({ message: 'Database updated successfully' });
  } catch (error) {
    console.error('Failed to update database:', error);
    return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}