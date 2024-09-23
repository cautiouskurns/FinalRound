import React, { useState } from 'react';
import { Concept, Topic, Question } from './components-syllabus';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ScrollArea } from "@/components/ui/scroll-area"; // {{ edit_1 }} Import ScrollArea

interface ConceptTopicPageProps {
  item: Concept | Topic;
  onClose: () => void;
  onBack: () => void;
}

export function ConceptTopicPage({ item, onClose, onBack }: ConceptTopicPageProps) {
  const isTopic = 'concepts' in item;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-5xl w-full max-h-[90vh]"> {/* Increased padding */}
        <Button onClick={onClose} className="mb-4">Close</Button>
        <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
        <p className="mb-4">{item.details}</p>

        <ScrollArea className="h-[70vh]"> {/* {{ edit_2 }} Added ScrollArea */}
          {isTopic ? (
            <TopicContent topic={item as Topic} />
          ) : (
            <ConceptContent concept={item as Concept} />
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

function TopicContent({ topic }: { topic: Topic }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Concepts</h2>
      <Table>
        <TableCaption>List of concepts for {topic.name}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Concept</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topic.concepts.map((concept, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{concept.name}</TableCell>
              <TableCell>{concept.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ConceptContent({ concept }: { concept: Concept }) {
  const [questions, setQuestions] = useState<Question[]>(concept.questions || []);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const addQuestion = () => {
    if (newQuestion && newAnswer) {
      setQuestions([...questions, { question: newQuestion, answer: newAnswer }]);
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {concept.codeExample && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Code Example</h2>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="rounded-md">
            {concept.codeExample}
          </SyntaxHighlighter>
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Questions</h2>
        <Table>
          <TableCaption>Questions and Answers for {concept.name}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Question</TableHead>
              <TableHead className="w-[40%]">Answer</TableHead>
              <TableHead className="w-[20%]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q, index) => (
              <TableRow key={index}>
                <TableCell>{q.question}</TableCell>
                <TableCell>{q.answer}</TableCell>
                <TableCell>
                  <Button onClick={() => removeQuestion(index)} variant="destructive" size="sm">Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="space-y-2">
        <Input
          placeholder="New question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <Textarea
          placeholder="Answer"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <Button onClick={addQuestion}>Add Question</Button>
      </div>
    </div>
  );
}