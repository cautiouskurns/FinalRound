import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db: any = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
  }
  return db;
}

export async function initDb() {
  const db = await getDb();
  
  try {
    // Create subjects table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        details TEXT
      );
    `);

    // Create topics table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        details TEXT,
        subject_id INTEGER,
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
      );
    `);

    // Create concepts table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS concepts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        details TEXT,
        topic_id INTEGER,
        FOREIGN KEY (topic_id) REFERENCES topics(id)
      );
    `);

    // Add subject_id column to topics table if it doesn't exist
    const topicColumns = await db.all("PRAGMA table_info(topics)");
    const subjectIdExists = topicColumns.some(col => col.name === 'subject_id');
    if (!subjectIdExists) {
      await db.exec(`ALTER TABLE topics ADD COLUMN subject_id INTEGER;`);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}