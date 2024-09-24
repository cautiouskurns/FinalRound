import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function uploadSyllabusData(filePath: string) {
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  try {
    const response = await fetch('http://localhost:3000/api/upload-syllabus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Upload result:', result);
  } catch (error) {
    console.error('Error uploading syllabus data:', error);
  }
}

// Check if a file path is provided as a command-line argument
const filePath = process.argv[2] || path.resolve(__dirname, '../public/data/syllabus.json');

uploadSyllabusData(filePath);