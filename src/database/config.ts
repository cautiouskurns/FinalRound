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
  await db.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      details TEXT
    );

    CREATE TABLE IF NOT EXISTS concepts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      details TEXT
    );

    -- Check if topic_id column exists in concepts table
    PRAGMA table_info(concepts);
  `);

  // Check if topic_id column exists
  const columns = await db.all("PRAGMA table_info(concepts)");
  const topicIdExists = columns.some(col => col.name === 'topic_id');

  if (!topicIdExists) {
    // Add topic_id column if it doesn't exist
    await db.exec(`
      ALTER TABLE concepts ADD COLUMN topic_id INTEGER;
      CREATE INDEX IF NOT EXISTS idx_concepts_topic_id ON concepts(topic_id);
    `);
  }
}