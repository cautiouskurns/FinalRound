import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Concept, Topic, Question } from './components-syllabus';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface ConceptTopicPageProps {
  item: Topic | Concept;
  onClose: () => void;
  onBack: () => void;
}

export function ConceptTopicPage({ item, onClose, onBack }: ConceptTopicPageProps) {
  const isTopic = 'concepts' in item;
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedDetails, setEditedDetails] = useState(item.details);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState("overview");

  const handleSave = () => {
    item.name = editedName;
    item.details = editedDetails;
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={onBack}>Topics</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Button onClick={onClose}>Close</Button>
          </div>

          <div className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-2xl font-bold"
                />
                <Textarea
                  value={editedDetails}
                  onChange={(e) => setEditedDetails(e.target.value)}
                />
                <div>
                  <Button onClick={handleSave} className="mr-2">Save</Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">{item.name}</h1>
                <p>{item.details}</p>
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-3 space-y-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="code">Code Examples</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                </TabsList>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "overview" && (
                      <TabsContent value="overview" className="mt-0">
                        <Card>
                          <CardHeader>
                            <CardTitle>Overview</CardTitle>
                            <CardDescription>A brief overview of {item.name}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>{item.details}</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    )}
                    {activeTab === "details" && (
                      <TabsContent value="details" className="mt-0">
                        {isTopic ? (
                          <TopicContent topic={item as Topic} />
                        ) : (
                          <ConceptContent concept={item as Concept} />
                        )}
                      </TabsContent>
                    )}
                    {activeTab === "code" && (
                      <TabsContent value="code" className="mt-0">
                        <CodeExamples concept={item as Concept} />
                      </TabsContent>
                    )}
                    {activeTab === "questions" && (
                      <TabsContent value="questions" className="mt-0">
                        <QuestionTable concept={item as Concept} searchQuery={searchQuery} />
                      </TabsContent>
                    )}
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </div>
            <div className="col-span-1 space-y-8">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Related Concepts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Related Concept 1</li>
                    <li>Related Concept 2</li>
                    <li>Related Concept 3</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Search questions....."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CodeExample {
  label?: string;
  code?: string;
}

function CodeExamples({ concept }: { concept: Concept }) {
  console.log('Concept:', concept);
  console.log('Code Examples (raw):', concept.code_example);
  console.log('Type of Code Examples:', typeof concept.code_example);

  let codeExamples = [];
  if (typeof concept.code_example === 'string') {
    try {
      codeExamples = JSON.parse(concept.code_example);
      console.log('Parsed Code Examples:', codeExamples);
    } catch (error) {
      console.error('Error parsing code examples:', error);
      // If parsing fails, use the string as is
      codeExamples = [{ code: concept.code_example }];
    }
  } else if (Array.isArray(concept.code_example)) {
    codeExamples = concept.code_example;
  } else if (concept.code_example) {
    codeExamples = [concept.code_example];
  }

  codeExamples = Array.isArray(codeExamples) ? codeExamples : [codeExamples];

  console.log('Final Code Examples:', codeExamples);
  console.log('Code Examples Length:', codeExamples.length);

  if (codeExamples.length === 0) {
    console.warn('No code examples found for:', concept.name);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
          <CardDescription>No code examples available for {concept.name}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Examples</CardTitle>
        <CardDescription>Code examples for {concept.name}</CardDescription>
      </CardHeader>
      <CardContent>
        {codeExamples.map((example: CodeExample, index: number) => (            
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{example.label || `Example ${index + 1}`}</h3>
            {example.code ? (
              <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="rounded-md">
                {example.code}
              </SyntaxHighlighter>
            ) : (
              <p>No code provided for this example.</p>
            )}
            {example.code && (
              <Button onClick={() => navigator.clipboard.writeText(example.code ?? '')} className="mt-2">
                Copy Code
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function QuestionTable({ concept, searchQuery }: { concept: Concept, searchQuery: string }) {
  const [questions, setQuestions] = useState<Question[]>(() => {
    console.log('Initial questions:', concept.questions);
    return concept.questions || [];
  });

  const filteredQuestions = useMemo(() => {
    return questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.question_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [questions, searchQuery]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  console.log('Filtered questions:', filteredQuestions);

  const openAddDialog = () => {
    setEditingQuestion({ question: '', answer: '', question_type: 'technical' });
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredQuestions.map((question, index) => (
            <TableRow key={index}>
              <TableCell>{question.question}</TableCell>
              <TableCell>{question.answer}</TableCell>
              <TableCell>{question.question_type}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3}>
              <Button onClick={openAddDialog} variant="outline" size="sm" className="w-full">Add Question</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
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

function TopicContent({ topic }: { topic: Topic }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Concepts</CardTitle>
        <CardDescription>List of concepts for {topic.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
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
      </CardContent>
    </Card>
  );
}

function ConceptContent({ concept }: { concept: Concept }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardDescription>Detailed information about {concept.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{concept.details}</p>
      </CardContent>
    </Card>
  );
}
