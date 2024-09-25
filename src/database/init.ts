import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import syllabusData from '../../public/data/syllabus_enhanced.json';

let db: any;

export async function initDatabase() {
    if (db) return db;

	db = await open({
		filename: './mydb.sqlite',
		driver: sqlite3.Database,
	});

	await db.exec(`
		CREATE TABLE IF NOT EXISTS user (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			email TEXT UNIQUE
		);

		CREATE TABLE IF NOT EXISTS subjects (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT UNIQUE
		);

		CREATE TABLE IF NOT EXISTS topics (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			subject_id INTEGER,
			FOREIGN KEY (subject_id) REFERENCES subjects(id)
		);

		CREATE TABLE IF NOT EXISTS concepts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			details TEXT,
			code_example TEXT,
			topic_id INTEGER,
			FOREIGN KEY (topic_id) REFERENCES topics(id)
		);
	`);

	// Populate syllabus data if tables are empty
	const count = await db.get('SELECT COUNT(*) as count FROM subjects');
	if (count.count === 0) {
		for (const subject of syllabusData) {
			const { lastID: subjectId } = await db.run('INSERT OR IGNORE INTO subjects (name) VALUES (?)', subject.name);
			for (const topic of subject.topics) {
				const { lastID: topicId } = await db.run('INSERT INTO topics (name, subject_id) VALUES (?, ?)', topic.name, subjectId);
				for (const concept of topic.concepts) {
					await db.run(
						'INSERT INTO concepts (name, details, code_example, topic_id) VALUES (?, ?, ?, ?)',
						concept.name,
						concept.details,
						concept.codeExample,
						topicId
					);
				}
			}
		}
	}

	return db;
}

export function getDb() {
	if (!db) {
		throw new Error('Database not initialized. Call setupDatabase() first.');
	}
	return db;
}

