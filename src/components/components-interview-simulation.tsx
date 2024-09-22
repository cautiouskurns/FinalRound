'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

interface Question {
  question: string
  questionCode?: string
  answer: string
  answerCode?: string
  hint: string
  subject: string
  topic: string
  concept: string
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

export function InterviewSimulation() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

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
                hint: concept.details
              }))
            )
          )
        )
        console.log('Processed questions:', allQuestions);
        setQuestions(allQuestions)
        setCurrentQuestion(allQuestions[0])
      })
  }, [])

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

  const handleSubmit = () => {
    setIsSubmitted(true)
    setShowAnswer(true)
  }

  useEffect(() => {
    if (showAnswer) {
      setScore(prevScore => prevScore + 1)
    }
  }, [showAnswer])

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Interview Simulation</h2>
      
      {/* Breadcrumb */}
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

      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.question}</CardTitle>
          {currentQuestion.questionCode && (
            <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="mt-2">
              {currentQuestion.questionCode}
            </SyntaxHighlighter>
          )}
        </CardHeader>
        <CardContent>
          <Textarea
            className="mb-4"
            placeholder="Type your answer here..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <div className="flex space-x-4 mb-4">
            <Button onClick={handleSubmit}>Submit Answer</Button>
            <Button onClick={handleShowHint}>Show Hint</Button>
            <Button onClick={handleShowAnswer}>Show Answer</Button>
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
                <div className="bg-gray-100 p-4 rounded">
                  {userAnswer}
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2">Correct Answer:</h3>
                <div className="bg-gray-100 p-4 rounded">
                  {currentQuestion.answer}
                </div>
              </div>
            </div>
          )}
          {showAnswer && !isSubmitted && (
            <Alert className="mb-4">
              <AlertTitle>Answer</AlertTitle>
              <AlertDescription>
                {currentQuestion.answer}
                {currentQuestion.answerCode && (
                  <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="mt-2">
                    {currentQuestion.answerCode}
                  </SyntaxHighlighter>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      <div className="mt-4 text-xl font-bold">Score: {score}</div>
    </div>
  )
}