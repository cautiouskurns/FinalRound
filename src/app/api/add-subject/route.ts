import { NextResponse } from 'next/server';
import { getDb } from '../../../database/config';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const db = await getDb();
    
    await db.run('INSERT INTO subjects (name) VALUES (?)', [name]);
    
    return NextResponse.json({ 
      message: 'Subject added successfully',
      name 
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding subject:', error);
    return NextResponse.json({ error: 'Failed to add subject' }, { status: 500 });
  }
}