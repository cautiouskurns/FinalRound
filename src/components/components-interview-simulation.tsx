'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Question {
  question: string
  questionCode?: string
  answer: string
  answerCode?: string
  hint: string
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

  useEffect(() => {
    fetch('/data/syllabus.json')
      .then(response => response.json())
      .then(data => {
        const allQuestions = data.flatMap((subject: Subject) =>
          subject.topics.flatMap((topic: Topic) =>
            topic.concepts.flatMap((concept: Concept) =>
              concept.questions.map((question: Question) => ({
                ...question,
                hint: concept.details // Assuming hint is the concept details
              }))
            )
          )
        )
        setQuestions(allQuestions)
        setCurrentQuestion(allQuestions[0])
      })
  }, [])

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
          {showAnswer && (
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