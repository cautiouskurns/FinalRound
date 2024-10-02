'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DiffMatchPatch from 'diff-match-patch'
import { ErrorBoundary } from 'react-error-boundary'
import ReactDOMServer from 'react-dom/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from 'next/dynamic'
import type { editor } from 'monaco-editor'

interface Question {
  id: number;
  question: string;
  answer: string;
  question_code?: string;
  answer_code?: string;
  subject?: string;
  topic?: string;
  concept?: string;
  hint?: string;
  type?: 'technical' | 'competency';
}

interface Concept {
  id: number;
  name: string;
  details: string;
  code_example?: string;
  questions: Question[];
}

interface Topic {
  id: number;
  name: string;
  details: string;
  concepts: Concept[];
}

interface Subject {
  id: number;
  name: string;
  topics: Topic[];
}

interface FeedbackItem {
  question: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

function DiffView({ userAnswer, correctAnswer, language = 'text' }: { userAnswer: string, correctAnswer: string, language?: string }) {
  const dmp = new DiffMatchPatch()
  const diff = dmp.diff_main(userAnswer, correctAnswer)
  dmp.diff_cleanupSemantic(diff)

  const colorCodedDiff = diff.map(([operation, text], index) => {
    let className = ''
    switch (operation) { 
      case 1: // Insertion (in correct answer)
        className = 'bg-green-200 text-green-800'
        break
      case -1: // Deletion (in user answer)
        className = 'bg-red-200 text-red-800'
        break
      default: // No change
        className = ''
    }
    return <span key={index} className={className}>{text}</span>
  })

  if (language === 'javascript') {
    return (
      <div className="relative">
        <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
          {userAnswer}
        </SyntaxHighlighter>
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-auto pointer-events-none">
          <pre className="font-mono text-transparent bg-transparent">{colorCodedDiff}</pre>
        </div>
      </div>
    )
  }

  return <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{colorCodedDiff}</div>
}

function compareAnswers(userAnswer: string, correctAnswer: string) {
  const dmp = new DiffMatchPatch()
  const diff = dmp.diff_main(userAnswer, correctAnswer)
  dmp.diff_cleanupSemantic(diff)

  return diff.map(([operation, text], index) => {
    let className = ''
    switch (operation) {
      case 1: // Insertion (in correct answer)
        className = 'bg-green-200 text-green-800'
        break
      case -1: // Deletion (in user answer)
        className = 'bg-red-200 text-red-800'
        break
      default: // No change
        className = ''
    }
    return <span key={index} className={className}>{text}</span>
  })
}

function ErrorFallback({error}: {error: Error}) {
  return <div>Error rendering code: {error.message}</div>
}

function SafeSyntaxHighlighter({ children, ...props }: React.PropsWithChildren<any>) {
  if (typeof children !== 'string') {
    console.error('Invalid input to SyntaxHighlighter:', children)
    return <pre>{JSON.stringify(children, null, 2)}</pre>
  }
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SyntaxHighlighter {...props}>{children}</SyntaxHighlighter>
    </ErrorBoundary>
  )
}

function FeedbackPage({ feedback }: { feedback: FeedbackItem[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Feedback Summary</h2>
      {feedback.map((item, index) => (
        <Card key={index} className="mb-4">
          <CardHeader>
            <CardTitle>Question {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Question:</strong> {item.question}</p>
            <p><strong>Your Answer:</strong> {item.userAnswer}</p>
            <p><strong>Correct Answer:</strong> {item.correctAnswer}</p>
            <p><strong>Result:</strong> {item.isCorrect ? 'Correct' : 'Incorrect'}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export function InterviewSimulation() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [userTextAnswer, setUserTextAnswer] = useState('')
  const [userCodeAnswer, setUserCodeAnswer] = useState('')
  const [isTextSubmitted, setIsTextSubmitted] = useState(false)
  const [isCodeSubmitted, setIsCodeSubmitted] = useState(false)
  const [questionType, setQuestionType] = useState<'all' | 'technical' | 'competency'>('all')
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [activeTab, setActiveTab] = useState<string>('interview')
  const [codeOutput, setCodeOutput] = useState('')
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [appliedFilters, setAppliedFilters] = useState({
    questionType: 'all',
    subject: 'all',
    topic: 'all'
  })

  const handleSubmitText = useCallback(() => {
    setIsTextSubmitted(true)
  }, [])

  const handleSubmitCode = useCallback(() => {
    setIsCodeSubmitted(true)
  }, [])

  useEffect(() => {
    fetch('/api/syllabus')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setSubjects(data);
        const allQuestions = data.flatMap((subject: Subject) =>
          subject.topics.flatMap((topic: Topic) =>
            topic.concepts.flatMap((concept: Concept) =>
              concept.questions.map((question: Question) => ({
                ...question,
                subject: subject.name,
                topic: topic.name,
                concept: concept.name,
                hint: concept.details,
                type: question.question_code ? 'technical' : 'competency'
              }))
            )
          )
        )
        console.log('Processed questions:', allQuestions);
        setQuestions(allQuestions)
        setCurrentQuestion(allQuestions[0])
      })
      .catch(error => {
        console.error('Error fetching syllabus:', error);
      });
  }, [])

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => 
      (appliedFilters.questionType === 'all' || q.type === appliedFilters.questionType) &&
      (appliedFilters.subject === 'all' || q.subject === appliedFilters.subject) &&
      (appliedFilters.topic === 'all' || q.topic === appliedFilters.topic)
    );
  }, [questions, appliedFilters])

  const topics = useMemo(() => {
    if (selectedSubject === 'all') return [];
    const subject = subjects.find(s => s.name === selectedSubject);
    return subject ? subject.topics : [];
  }, [subjects, selectedSubject])

  const { currentSubject, currentTopic, currentConcept } = useMemo(() => {
    console.log('Current question:', currentQuestion);
    if (!currentQuestion) return { currentSubject: '', currentTopic: '', currentConcept: '' }
    return {
      currentSubject: currentQuestion.subject || 'Unknown Subject',
      currentTopic: currentQuestion.topic || 'Unknown Topic',
      currentConcept: currentQuestion.concept || 'Unknown Concept'
    }
  }, [currentQuestion])

  console.log('Breadcrumb values:', { currentSubject, currentTopic, currentConcept });

  const applyFilters = useCallback(() => {
    const newFilters = {
      questionType,
      subject: selectedSubject,
      topic: selectedTopic
    };

    setAppliedFilters(newFilters);

    const newFilteredQuestions = questions.filter(q => 
      (newFilters.questionType === 'all' || q.type === newFilters.questionType) &&
      (newFilters.subject === 'all' || q.subject === newFilters.subject) &&
      (newFilters.topic === 'all' || q.topic === newFilters.topic)
    );

    if (newFilteredQuestions.length > 0) {
      setCurrentQuestion(newFilteredQuestions[0]);
      setCurrentQuestionIndex(0);
    } else {
      setCurrentQuestion(null);
      setCurrentQuestionIndex(-1);
    }
  }, [questions, questionType, selectedSubject, selectedTopic]);

  const handleShowHint = () => {
    setShowHint(true)
  }

  const handleShowAnswer = () => {
    setShowAnswer(true)
  }

  const handleSubmit = useCallback(() => {
    setIsSubmitted(true)
    setShowAnswer(true)

    if (currentQuestion) {
      const newFeedbackItem: FeedbackItem = {
        question: currentQuestion.question,
        userAnswer: userTextAnswer,
        correctAnswer: currentQuestion.answer,
        isCorrect: userTextAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase()
      }
      setFeedback(prevFeedback => [...prevFeedback, newFeedbackItem])
    }
  }, [currentQuestion, userTextAnswer])

  useEffect(() => {
    if (showAnswer) {
      setScore(prevScore => prevScore + 1)
    }
  }, [showAnswer])

  const handleRunCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue()
      try {
        let output = '';
        // Create a mock print function
        const print = (text: any) => {
          output += String(text) + '\n';
        };
        // Wrap the code in a function with our mock print
        const wrappedCode = `
          (function() {
            ${code}
          })();
        `;
        new Function('print', wrappedCode)(print);
        setCodeOutput(output || 'No output');
      } catch (error) {
        setCodeOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setCurrentQuestion(filteredQuestions[currentQuestionIndex + 1]);
      resetQuestionState();
    }
  }, [currentQuestionIndex, filteredQuestions]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      setCurrentQuestion(filteredQuestions[currentQuestionIndex - 1]);
      resetQuestionState();
    }
  }, [currentQuestionIndex, filteredQuestions]);

  const resetQuestionState = () => {
    setUserAnswer('');
    setShowHint(false);
    setShowAnswer(false);
    setIsSubmitted(false);
    // Reset any other question-specific state here
  };

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Interview Simulation</h2>
      
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>{appliedFilters.subject === 'all' ? 'All Subjects' : appliedFilters.subject}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {appliedFilters.subject !== 'all' && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink>{appliedFilters.topic === 'all' ? 'All Topics' : appliedFilters.topic}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{currentConcept}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Filters */}
      <div className="mb-4 flex space-x-4">
        <Select value={questionType} onValueChange={(value: any) => setQuestionType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Question Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Questions</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="competency">Competency</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTopic} onValueChange={setSelectedTopic} disabled={selectedSubject === 'all'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {topics.map(topic => (
              <SelectItem key={topic.id} value={topic.name}>{topic.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>

      {currentQuestion && (
        <div className="grid grid-cols-2 gap-4">
          {/* Text Question and Answer */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Question</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{currentQuestion.question}</p>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Text Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                className="w-full h-40"
                value={userTextAnswer}
                onChange={(e) => setUserTextAnswer(e.target.value)}
                placeholder="Type your answer here..."
              />
            </CardContent>
          </Card>

          {/* Code Question and Answer */}
          {currentQuestion.question_code && (
            <>
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Code Question</CardTitle>
                </CardHeader>
                <CardContent>
                  <SafeSyntaxHighlighter language="javascript" style={vscDarkPlus}>
                    {currentQuestion.question_code}
                  </SafeSyntaxHighlighter>
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Code Answer</CardTitle>
                </CardHeader>
                <CardContent>
                  <MonacoEditor
                    height="200px"
                    language="javascript"
                    theme="vs-dark"
                    value={userCodeAnswer}
                    onChange={(value) => setUserCodeAnswer(value || '')}
                    onMount={(editor) => {
                      editorRef.current = editor
                    }}
                  />
                  <Button onClick={handleRunCode} className="mt-2">Run Code</Button>
                  {codeOutput && (
                    <div className="mt-2 p-2 bg-gray-100 rounded">
                      <h4 className="font-bold">Output:</h4>
                      <pre>{codeOutput}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex space-x-4 mt-4">
        <Button onClick={handleSubmit}>Submit Answer</Button>
        <Button onClick={handleShowHint}>Show Hint</Button>
        <Button onClick={handleShowAnswer}>Show Correct Answer</Button>
        <Button onClick={handleNextQuestion}>Next Question</Button>
      </div>

      {/* Hint and Answer Display */}
      {showHint && (
        <Alert className="mt-4">
          <AlertTitle>Hint</AlertTitle>
          <AlertDescription>{currentQuestion?.hint}</AlertDescription>
        </Alert>
      )}

      {showAnswer && (
        <Alert className="mt-4">
          <AlertTitle>Correct Answer</AlertTitle>
          <AlertDescription>
            {currentQuestion?.answer}
            {currentQuestion?.answer_code && (
              <SafeSyntaxHighlighter language="javascript" style={vscDarkPlus} className="mt-2">
                {currentQuestion.answer_code}
              </SafeSyntaxHighlighter>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Navigation */}
      <div className="mt-4 flex justify-between">
        <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Previous</Button>
        <Button onClick={handleNextQuestion} disabled={currentQuestionIndex === filteredQuestions.length - 1}>Next</Button>
      </div>
    </div>
  )
}