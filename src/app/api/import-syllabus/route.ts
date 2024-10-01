import { NextResponse } from 'next/server';
import { importSyllabus } from '../../../utils/importSyllabus';

export async function POST(request: Request) {
  try {
    const syllabusData = await request.json();
    await importSyllabus(syllabusData);
    return NextResponse.json({ message: 'Syllabus imported successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error importing syllabus:', error);
    return NextResponse.json({ error: 'Failed to import syllabus' }, { status: 500 });
  }
}