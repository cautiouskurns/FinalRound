import { NextResponse } from 'next/server';
import { initDatabase, getDb } from '../../../database/init';
import { Database } from 'sqlite';

export async function GET() {
  try {
    await initDatabase(); // Add this line to initialize the database
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

export async function POST(request: Request) {
  console.log('POST request received for /api/syllabus');
  let db;
  try {
    await initDatabase();
    console.log('Database initialized');
    db = await getDb();
    const syllabusData = await request.json();
    console.log('Received syllabus data:', JSON.stringify(syllabusData, null, 2));

    await db.run('BEGIN TRANSACTION');
    console.log('Transaction started');

    // Clear existing data
    await db.run('DELETE FROM questions');
    await db.run('DELETE FROM concepts');
    await db.run('DELETE FROM topics');
    await db.run('DELETE FROM subjects');
    console.log('Existing data cleared');

    let insertedSubjects = 0, insertedTopics = 0, insertedConcepts = 0, insertedQuestions = 0;

    for (const subject of syllabusData) {
      const { lastID: subjectId } = await db.run('INSERT INTO subjects (name) VALUES (?)', subject.name);
      insertedSubjects++;

      for (const topic of subject.topics) {
        const { lastID: topicId } = await db.run('INSERT INTO topics (name, details, subject_id) VALUES (?, ?, ?)', 
          [topic.name, topic.details, subjectId]);
        insertedTopics++;

        for (const concept of topic.concepts) {
          const { lastID: conceptId } = await db.run('INSERT INTO concepts (name, details, code_example, topic_id) VALUES (?, ?, ?, ?)', 
            [concept.name, concept.details, concept.codeExample, topicId]);
          insertedConcepts++;

          if (concept.questions) {
            for (const question of concept.questions) {
              await db.run('INSERT INTO questions (question, answer, question_code, answer_code, concept_id) VALUES (?, ?, ?, ?, ?)', 
                [question.question, question.answer, question.questionCode, question.answerCode, conceptId]);
              insertedQuestions++;
            }
          }
        }
      }
    }

    await db.run('COMMIT');
    console.log('Transaction committed');
    console.log(`Inserted: ${insertedSubjects} subjects, ${insertedTopics} topics, ${insertedConcepts} concepts, ${insertedQuestions} questions`);

    // Fetch and log the current database contents
    const dbContents = await getDbContents(db);
    console.log('Current database contents:', JSON.stringify(dbContents, null, 2));

    return NextResponse.json({ 
      message: 'Syllabus imported successfully',
      stats: {
        insertedSubjects,
        insertedTopics,
        insertedConcepts,
        insertedQuestions
      },
      dbContents
    }, { status: 200 });
  } catch (error) {
    console.error('Error importing syllabus:', error);
    if (db) await db.run('ROLLBACK');
    return NextResponse.json(
      { message: 'Failed to import syllabus', error: (error as Error).message },
      { status: 500 }
    );
  }
}

async function getDbContents(db: Database) {
  const subjects = await db.all('SELECT * FROM subjects');
  const topics = await db.all('SELECT * FROM topics');
  const concepts = await db.all('SELECT * FROM concepts');
  const questions = await db.all('SELECT * FROM questions');
  return { subjects, topics, concepts, questions };
}