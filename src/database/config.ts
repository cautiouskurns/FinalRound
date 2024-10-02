import sqlite3 from 'sqlite3'
import { open, Database as SqliteDatabase } from 'sqlite'

let db: SqliteDatabase | null = null;

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
        topic_id INTEGER,
        FOREIGN KEY (topic_id) REFERENCES topics(id)
      );
    `);

    // Check if code_example column exists in concepts table
    const columns = await db.all("PRAGMA table_info(concepts)");
    const codeExampleExists = columns.some((col: { name: string }) => col.name === 'code_example');

    if (!codeExampleExists) {
      // Add code_example column if it doesn't exist
      await db.exec(`
        ALTER TABLE concepts ADD COLUMN code_example TEXT;
      `);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export type Database = SqliteDatabase;