import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getDb } from '../../../database/init';

export async function POST(request: NextRequest) {
  await initDatabase();
  const db = getDb();
  
  try {
    const jsonData = await request.json();

    // Start a transaction
    await db.run('BEGIN TRANSACTION');

    // Clear existing data
    await db.run('DELETE FROM questions');
    await db.run('DELETE FROM concepts');
    await db.run('DELETE FROM topics');
    await db.run('DELETE FROM subjects');

    for (const subject of jsonData) {
      const { lastID: subjectId } = await db.run('INSERT INTO subjects (name) VALUES (?)', subject.name);

      for (const topic of subject.topics) {
        const { lastID: topicId } = await db.run('INSERT INTO topics (name, details, subject_id) VALUES (?, ?, ?)', 
          [topic.name, topic.details, subjectId]);

        for (const concept of topic.concepts) {
          const { lastID: conceptId } = await db.run('INSERT INTO concepts (name, details, code_example, topic_id) VALUES (?, ?, ?, ?)', 
            [concept.name, concept.details, concept.codeExample, topicId]);

          if (concept.questions) {
            for (const question of concept.questions) {
              await db.run('INSERT INTO questions (question, answer, question_code, answer_code, concept_id) VALUES (?, ?, ?, ?, ?)', 
                [question.question, question.answer, question.questionCode, question.answerCode, conceptId]);
            }
          }
        }
      }
    }

    // Commit the transaction
    await db.run('COMMIT');

    return NextResponse.json({ message: 'Syllabus data uploaded successfully' });
  } catch (error) {
    // Rollback the transaction in case of error
    await db.run('ROLLBACK');
    return NextResponse.json(
      { message: 'Failed to upload syllabus data', error: (error as Error).message },
      { status: 500 }
    );
  }
}