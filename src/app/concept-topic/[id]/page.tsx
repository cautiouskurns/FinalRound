'use client'

import { useParams, useRouter } from 'next/navigation';
import { ConceptTopicPage } from '@/components/ConceptTopicPage';
import { useEffect, useState } from 'react';
import { Concept, Topic } from '@/components/components-syllabus';

export default function ConceptTopicPageWrapper() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [item, setItem] = useState<Concept | Topic | null>(null);

  useEffect(() => {
    if (id) {
      // Simulate fetching data
      setTimeout(() => {
        setItem({
          name: 'Sample Concept',
          details: 'This is a sample concept.',
          codeExample: 'console.log("Hello, world!");',
          questions: [
            {
              question: 'What does this code do?',
              answer: 'It prints "Hello, world!" to the console.'
            }
          ]
        } as Concept);
      }, 100);
    }
  }, [id]);

  const handleBack = () => {
    router.push('/');
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return <ConceptTopicPage item={item} onBack={handleBack} onClose={handleBack} />;
}