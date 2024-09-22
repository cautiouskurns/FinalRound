'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Question {
  id: number
  text: string
  topic: string
  hint: string
  answer: string
}

const questions: Question[] = [
  {
    id: 1,
    text: 'What is a closure in JavaScript?',
    topic: 'JavaScript',
    hint: 'Think about function scope and variable access.',
    answer: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.'
  },
  {
    id: 2,
    text: 'Explain the difference between props and state in React.',
    topic: 'React',
    hint: 'Consider data flow and mutability.',
    answer: 'Props are read-only data passed from parent to child components, while state is mutable data managed within a component.'
  }
]

export function InterviewSimulation() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[0])
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)

  const handleNextQuestion = () => {
    const nextIndex = questions.findIndex(q => q.id === currentQuestion.id) + 1
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

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Interview Simulation</h2>
      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.text}</CardTitle>
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
              <AlertDescription>{currentQuestion.answer}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      <div className="mt-4 text-xl font-bold">Score: {score}</div>
    </div>
  )
}