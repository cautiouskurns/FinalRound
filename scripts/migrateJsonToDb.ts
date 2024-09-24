const fs = require('fs');
const path = require('path');
const { initDatabase, getDb } = require('../src/database/init');

async function migrateData() {
  await initDatabase();
  const db = getDb();

  const jsonData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/data/syllabus.json'), 'utf-8'));

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

  console.log('Data migration completed successfully');
}

migrateData().catch(console.error);