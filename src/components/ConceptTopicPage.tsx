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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ConceptTopicPageProps {
  item: Concept | Topic;
  onClose: () => void;
  onBack: () => void;
}

export function ConceptTopicPage({ item, onClose, onBack }: ConceptTopicPageProps) {
  const isTopic = 'concepts' in item;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <Button onClick={onClose} className="mb-4">Close</Button>
        <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
        <p className="mb-4">{item.details}</p>

        {isTopic ? (
          <TopicContent topic={item as Topic} />
        ) : (
          <ConceptContent concept={item as Concept} />
        )}
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

  const openEditDialog = (question: Question, index: number) => {
    setEditingQuestion(question);
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const saveEditedQuestion = () => {
    if (editingQuestion && editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = editingQuestion;
      setQuestions(updatedQuestions);
      setIsDialogOpen(false);
      setEditingQuestion(null);
      setEditingIndex(null);
    }
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
                  <Button onClick={() => openEditDialog(q, index)} variant="outline" size="sm" className="mr-2">Edit</Button>
                  <Button onClick={() => removeQuestion(index)} variant="destructive" size="sm">Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[850px] w-11/12 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Make changes to the question and answer here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingQuestion && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question" className="text-right">
                  Question
                </Label>
                <Input
                  id="question"
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({...editingQuestion, question: e.target.value})}
                  className="col-span-3 h-20"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="answer" className="text-right">
                  Answer
                </Label>
                <Textarea
                  id="answer"
                  value={editingQuestion.answer}
                  onChange={(e) => setEditingQuestion({...editingQuestion, answer: e.target.value})}
                  className="col-span-3 h-40"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={saveEditedQuestion}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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