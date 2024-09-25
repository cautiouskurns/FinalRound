'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
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

interface Question {
  question: string
  questionCode?: string
  answer: string
  answerCode?: string
  hint: string
  subject: string
  topic: string
  concept: string
  type: 'technical' | 'competency'
}

interface Concept {
  name: string
  details: string
  questions: Question[]
}

interface Topic {
  name: string
  details: string
  concepts: Concept[]
}

interface Subject {
  name: string
  topics: Topic[]
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

  const handleSubmitText = useCallback(() => {
    setIsTextSubmitted(true)
  }, [])

  const handleSubmitCode = useCallback(() => {
    setIsCodeSubmitted(true)
  }, [])

  useEffect(() => {
    fetch('/data/syllabus.json')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        const allQuestions = data.flatMap((subject: Subject) =>
          subject.topics.flatMap((topic: Topic) =>
            topic.concepts.flatMap((concept: Concept) =>
              concept.questions.map((question: Question) => ({
                ...question,
                subject: subject.name,
                topic: topic.name,
                concept: concept.name,
                hint: concept.details,
                type: question.questionCode ? 'technical' : 'competency' // Assuming questions with code are technical
              }))
            )
          )
        )
        console.log('Processed questions:', allQuestions);
        setQuestions(allQuestions)
        setCurrentQuestion(allQuestions[0])
      })
  }, [])

  const filteredQuestions = useMemo(() => {
    if (questionType === 'all') return questions;
    return questions.filter(q => q.type === questionType);
  }, [questions, questionType])

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

  const handleNextQuestion = () => {
    const currentIndex = questions.findIndex(q => q.question === currentQuestion?.question)
    const nextIndex = currentIndex + 1
    if (nextIndex < questions.length) {
      setCurrentQuestion(questions[nextIndex])
      setUserAnswer('')
      setShowHint(false)
      setShowAnswer(false)
    }
  }

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

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Interview Simulation</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="interview">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>{currentSubject}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{currentTopic}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentConcept}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mb-4">
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
          </div>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{currentQuestion.question}</CardTitle>
              {currentQuestion.questionCode && (
                <SafeSyntaxHighlighter language="javascript" style={vscDarkPlus} className="mt-2">
                  {currentQuestion.questionCode || ''}
                </SafeSyntaxHighlighter>
              )}
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block mb-2 font-bold">Text Answer:</label>
                <Textarea
                  className="mb-2 h-64"
                  value={userTextAnswer}
                  onChange={(e) => setUserTextAnswer(e.target.value)}
                />
              </div>
              
              {currentQuestion.type === 'technical' && (
                <div className="mb-4">
                  <label className="block mb-2 font-bold">Code Answer:</label>
                  <Textarea
                    className="mb-2 h-64 bg-gray-800 text-white font-mono"
                    value={userCodeAnswer}
                    onChange={(e) => setUserCodeAnswer(e.target.value)}
                  />
                </div>
              )}

              <div className="flex space-x-4 mb-4">
                <Button onClick={handleSubmit}>Submit Answer</Button>
                <Button onClick={handleShowHint}>Show Hint</Button>
                <Button onClick={handleShowAnswer}>Show Correct Answer</Button>
                <Button onClick={handleNextQuestion}>Next Question</Button>
              </div>

              {showHint && (
                <Alert className="mb-4">
                  <AlertTitle>Hint</AlertTitle>
                  <AlertDescription>{currentQuestion.hint}</AlertDescription>
                </Alert>
              )}

              {isSubmitted && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-bold mb-2">Your Answer:</h3>
                    <DiffView userAnswer={userTextAnswer} correctAnswer={currentQuestion.answer} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Correct Answer:</h3>
                    <DiffView userAnswer={currentQuestion.answer} correctAnswer={userTextAnswer} />
                  </div>
                </div>
              )}

              {isSubmitted && currentQuestion.type === 'technical' && currentQuestion.answerCode && (
                <div className="mb-4">
                  <h3 className="font-bold mb-2">Code Answer Comparison:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Your Code:</h4>
                      <DiffView userAnswer={userCodeAnswer} correctAnswer={currentQuestion.answerCode} language="javascript" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Correct Code:</h4>
                      <DiffView userAnswer={currentQuestion.answerCode} correctAnswer={userCodeAnswer} language="javascript" />
                    </div>
                  </div>
                </div>
              )}

              {showAnswer && (
                <Alert className="mb-4">
                  <AlertTitle>Correct Answer</AlertTitle>
                  <AlertDescription>
                    {currentQuestion.answer}
                    {currentQuestion.answerCode && (
                      <SafeSyntaxHighlighter language="javascript" style={vscDarkPlus} className="mt-2">
                        {currentQuestion.answerCode || ''}
                      </SafeSyntaxHighlighter>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="mt-4 text-xl font-bold">Score: {score}</div>
        </TabsContent>
        <TabsContent value="feedback">
          <FeedbackPage feedback={feedback} />
        </TabsContent>
      </Tabs>
    </div>
  )
}