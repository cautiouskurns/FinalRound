import React, { useEffect, useState } from 'react'; // {{ edit_1 }} Import useState
import { motion } from 'framer-motion'; // {{ edit_1 }} Import motion
import { Concept, Topic } from './components-syllabus';
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ConceptTopicPageProps {
  item: Concept | Topic;
  onClose: () => void;
  onBack: () => void; // {{ edit_1 }} Add this line
}

export function ConceptTopicPage({ item, onClose, onBack }: ConceptTopicPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isTopic = 'concepts' in item;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }} // {{ edit_2 }} Initial state
      animate={{ opacity: 1 }} // {{ edit_3 }} Animate to this state
      exit={{ opacity: 0 }} // {{ edit_4 }} Exit state
      transition={{ duration: 0.3 }} // {{ edit_5 }} Transition duration
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-5xl w-full max-h-[220vh] overflow-y-auto">
        <Button onClick={onClose} className="mb-4">Close</Button>
        <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
        <p className="mb-4">{item.details}</p>

        {isTopic ? (
          <TopicContent topic={item as Topic} />
        ) : (
          <ConceptContent concept={item as Concept} />
        )}
      </div>
    </motion.div>
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