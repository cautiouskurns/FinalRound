import React from 'react';
import { Concept, Topic } from './components-syllabus';
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ConceptTopicPageProps {
  item: Concept | Topic;
  onBack: () => void;
}

export function ConceptTopicPage({ item, onBack }: ConceptTopicPageProps) {
  const isTopic = 'concepts' in item;

  return (
    <div className="container mx-auto p-4">
      <Button onClick={onBack} className="mb-4">Back to Syllabus</Button>
      <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
      <p className="mb-4">{item.details}</p>

      {isTopic ? (
        <TopicContent topic={item as Topic} />
      ) : (
        <ConceptContent concept={item as Concept} />
      )}
    </div>
  );
}

function TopicContent({ topic }: { topic: Topic }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Concepts</h2>
      {topic.concepts.map((concept, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-semibold">{concept.name}</h3>
          <p>{concept.details}</p>
          {concept.codeExample && (
            <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="mt-2">
              {concept.codeExample}
            </SyntaxHighlighter>
          )}
        </div>
      ))}
    </div>
  );
}

function ConceptContent({ concept }: { concept: Concept }) {
  return (
    <div>
      {concept.codeExample && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Code Example</h2>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
            {concept.codeExample}
          </SyntaxHighlighter>
        </div>
      )}
      {concept.questions && concept.questions.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Questions</h2>
          {concept.questions.map((question, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">Q: {question.question}</p>
              <p className="mt-2">A: {question.answer}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}