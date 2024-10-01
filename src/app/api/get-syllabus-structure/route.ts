import { NextResponse } from 'next/server';
import { getDb } from '../../../database/config';

export async function GET() {
  try {
    const db = await getDb();
    
    const syllabus = await db.all(`
      SELECT 
        s.id as subject_id, s.name as subject_name,
        t.id as topic_id, t.name as topic_name,
        c.id as concept_id, c.name as concept_name, c.details as concept_details
      FROM subjects s
      LEFT JOIN topics t ON s.id = t.subject_id
      LEFT JOIN concepts c ON t.id = c.topic_id
      ORDER BY s.id, t.id, c.id
    `);
    
    // Restructure the flat data into a nested object
    const structuredSyllabus = syllabus.reduce((acc, item) => {
      let subject = acc.find(s => s.id === item.subject_id);
      if (!subject) {
        subject = { id: item.subject_id, name: item.subject_name, topics: [] };
        acc.push(subject);
      }
      
      if (item.topic_id) {
        let topic = subject.topics.find(t => t.id === item.topic_id);
        if (!topic) {
          topic = { id: item.topic_id, name: item.topic_name, concepts: [] };
          subject.topics.push(topic);
        }
        
        if (item.concept_id) {
          topic.concepts.push({
            id: item.concept_id,
            name: item.concept_name,
            details: item.concept_details
          });
        }
      }
      
      return acc;
    }, []);
    
    return NextResponse.json(structuredSyllabus);
  } catch (error) {
    console.error('Error fetching syllabus:', error);
    return NextResponse.json({ error: 'Failed to fetch syllabus' }, { status: 500 });
  }
}