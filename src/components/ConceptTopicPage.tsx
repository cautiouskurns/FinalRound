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
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedDetails, setEditedDetails] = useState(item.details);

  const handleSave = () => {
    // Here you would typically update the item in your data store
    item.name = editedName;
    item.details = editedDetails;
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <Button onClick={onClose} className="mb-4">Close</Button>
        {isEditing ? (
          <>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-2xl font-bold mb-4"
            />
            <Textarea
              value={editedDetails}
              onChange={(e) => setEditedDetails(e.target.value)}
              className="mb-4"
            />
            <Button onClick={handleSave} className="mr-2">Save</Button>
            <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
            <p className="mb-4">{item.details}</p>
            <Button onClick={() => setIsEditing(true)} className="mb-4">Edit</Button>
          </>
        )}

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingQuestion({ question: '', answer: '' });
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (question: Question, index: number) => {
    setEditingQuestion(question);
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const saveQuestion = () => {
    if (editingQuestion) {
      if (editingIndex !== null) {
        // Edit existing question
        const updatedQuestions = [...questions];
        updatedQuestions[editingIndex] = editingQuestion;
        setQuestions(updatedQuestions);
      } else {
        // Add new question
        setQuestions([...questions, editingQuestion]);
      }
      setIsDialogOpen(false);
      setEditingQuestion(null);
      setEditingIndex(null);
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
          {/* <TableCaption>Questions and Answers for {concept.name}</TableCaption> */}
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
            <TableRow>
              <TableCell colSpan={3}>
                <Button onClick={openAddDialog} variant="outline" size="sm" className="w-full">Add Question</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[850px] w-11/12 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? 'Edit' : 'Add'} Question</DialogTitle>
            <DialogDescription>
              {editingIndex !== null ? 'Make changes to' : 'Enter'} the question and answer here. Click save when you're done.
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
            <Button onClick={saveQuestion}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}