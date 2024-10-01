import { NextResponse } from 'next/server';
import { getDb } from '../../../database/config';

export async function GET() {
  try {
    const db = await getDb();
    
    const subjects = await db.all(`
      SELECT id, name
      FROM subjects
    `);

    for (const subject of subjects) {
      subject.topics = await db.all(`
        SELECT id, name, details
        FROM topics
        WHERE subject_id = ?
      `, [subject.id]);

      for (const topic of subject.topics) {
        topic.concepts = await db.all(`
          SELECT id, name, details, code_example
          FROM concepts
          WHERE topic_id = ?
        `, [topic.id]);
      }
    }

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error fetching syllabus:', error);
    return NextResponse.json({ error: 'Failed to fetch syllabus' }, { status: 500 });
  }
}