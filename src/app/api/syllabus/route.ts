import { NextResponse } from 'next/server';
import { getDb, initDb } from '../../../database/config';

async function ensureTablesExist(db: any) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      details TEXT,
      subject_id INTEGER,
      FOREIGN KEY (subject_id) REFERENCES subjects(id)
    );

    CREATE TABLE IF NOT EXISTS concepts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      details TEXT,
      code_example TEXT,
      topic_id INTEGER,
      FOREIGN KEY (topic_id) REFERENCES topics(id)
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT,
      question_code TEXT,
      answer_code TEXT,
      concept_id INTEGER,
      FOREIGN KEY (concept_id) REFERENCES concepts(id)
    );
  `);
}

export async function GET(request: Request) {
  try {
    await initDb(); // Changed from initDatabase to initDb
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
  try {
    await initDb();
    const db = await getDb();

    // Ensure tables exist
    await ensureTablesExist(db);

    await db.run('BEGIN TRANSACTION');

    const syllabusData = await request.json();
    console.log('Received syllabus data:', JSON.stringify(syllabusData, null, 2));

    // Clear existing data
    await db.run('DELETE FROM questions');
    await db.run('DELETE FROM concepts');
    await db.run('DELETE FROM topics');
    await db.run('DELETE FROM subjects');

    // Insert new data
    for (const subject of syllabusData) {
      console.log(`Inserting subject: ${subject.name}`);
      const { lastID: subjectId } = await db.run('INSERT INTO subjects (name) VALUES (?)', subject.name);

      for (const topic of subject.topics) {
        console.log(`Inserting topic: ${topic.name}`);
        const { lastID: topicId } = await db.run('INSERT INTO topics (name, details, subject_id) VALUES (?, ?, ?)', 
          topic.name, topic.details, subjectId);

        for (const concept of topic.concepts) {
          console.log(`Inserting concept: ${concept.name}`);
          const { lastID: conceptId } = await db.run('INSERT INTO concepts (name, details, code_example, topic_id) VALUES (?, ?, ?, ?)', 
            concept.name, concept.details, concept.codeExample, topicId);

          if (concept.questions) {
            for (const question of concept.questions) {
              console.log(`Inserting question: ${question.question.substring(0, 30)}...`);
              await db.run('INSERT INTO questions (question, answer, question_code, answer_code, concept_id) VALUES (?, ?, ?, ?, ?)', 
                question.question, question.answer, question.questionCode, question.answerCode, conceptId);
            }
          }
        }
      }
    }

    await db.run('COMMIT');
    console.log('Syllabus import completed successfully');
    return NextResponse.json({ message: 'Syllabus updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error importing syllabus:', error);
    return NextResponse.json({ error: 'Failed to import syllabus', details: (error as Error).message }, { status: 500 });
  }
}

async function getDbContents(db: Database) {
  const subjects = await db.all('SELECT * FROM subjects');
  const topics = await db.all('SELECT * FROM topics');
  const concepts = await db.all('SELECT * FROM concepts');
  const questions = await db.all('SELECT * FROM questions');
  return { subjects, topics, concepts, questions };
}