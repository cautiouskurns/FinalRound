import { NextResponse } from 'next/server';
import { initDatabase, getDb } from '../../../database/init';

export async function GET() {
  await initDatabase();
  const db = getDb();
  
  try {
    const subjects = await db.all('SELECT * FROM subjects');
    for (const subject of subjects) {
      subject.topics = await db.all('SELECT * FROM topics WHERE subject_id = ?', subject.id);
      for (const topic of subject.topics) {
        topic.concepts = await db.all('SELECT * FROM concepts WHERE topic_id = ?', topic.id);
        for (const concept of topic.concepts) {
          concept.questions = await db.all('SELECT * FROM questions WHERE concept_id = ?', concept.id);
        }
      }
    }
    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch syllabus data', error: (error as Error).message },
      { status: 500 }
    );
  }
}