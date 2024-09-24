import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export async function initDatabase() {
  if (db) {
    return db;
  }

  db = await open({
    filename: './mydb.sqlite',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE
    )
  `);

  return db;
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

