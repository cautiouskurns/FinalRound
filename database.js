const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Create table if it doesn't exist
const createTable = db.prepare(`CREATE TABLE IF NOT EXISTS concepts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  details TEXT
)`);

try {
  createTable.run();
  console.log('Table created or already exists');
} catch (err) {
  console.error('Error creating table', err);
}

module.exports = db;