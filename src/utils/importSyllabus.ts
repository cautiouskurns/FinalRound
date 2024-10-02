import { getDb } from '../database/config';

interface Concept {
  name: string;
  details: string;
  codeExample?: string;
}

interface Topic {
  name: string;
  details: string;
  concepts: Concept[];
}

interface Subject {
  name: string;
  topics: Topic[];
}

export async function importSyllabus(syllabusData: Subject[]) {
  const db = await getDb();

  try {
    await db.run('BEGIN TRANSACTION');

    for (const subject of syllabusData) {
      const { lastID: subjectId } = await db.run(
        'INSERT OR REPLACE INTO subjects (name) VALUES (?)',
        [subject.name]
      );

      for (const topic of subject.topics) {
        const { lastID: topicId } = await db.run(
          'INSERT OR REPLACE INTO topics (subject_id, name, details) VALUES (?, ?, ?)',
          [subjectId, topic.name, topic.details]
        );

        for (const concept of topic.concepts) {
          await db.run(
            'INSERT OR REPLACE INTO concepts (topic_id, name, details, code_example) VALUES (?, ?, ?, ?)',
            [topicId, concept.name, concept.details, concept.codeExample]
          );
        }
      }
    }

    await db.run('COMMIT');
    console.log('Syllabus imported successfully');
  } catch (error) {
    await db.run('ROLLBACK');
    console.error('Error importing syllabus:', error);
  }
}