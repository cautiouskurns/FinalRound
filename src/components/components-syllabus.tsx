'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Question {
  question: string
  questionCode?: string
  answer: string
  answerCode?: string
}

interface Concept {
  name: string
  details: string
  code?: string
  codeExample?: string  // Add this line
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

export function Syllabus() {
  const [syllabusData, setSyllabusData] = useState<Subject[]>([])
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set())
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const [expandedConcepts, setExpandedConcepts] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/data/syllabus.json')
      .then(response => response.json())
      .then(data => setSyllabusData(data))
  }, [])

  const toggleSubject = (subjectName: string) => {
    setExpandedSubjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(subjectName)) {
        newSet.delete(subjectName)
      } else {
        newSet.add(subjectName)
      }
      return newSet
    })
  }

  const toggleTopic = (topicName: string) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev)
      if (newSet.has(topicName)) {
        newSet.delete(topicName)
      } else {
        newSet.add(topicName)
      }
      return newSet
    })
  }

  const toggleConcept = (conceptName: string) => {
    setExpandedConcepts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(conceptName)) {
        newSet.delete(conceptName)
      } else {
        newSet.add(conceptName)
      }
      return newSet
    })
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Interview Syllabus</h2>
      <div className="grid grid-cols-12 gap-4 font-bold mb-2 border-b pb-2">
        <div className="col-span-1">Subject</div>
        <div className="col-span-1">Topic</div>
        <div className="col-span-2">Concept</div>
        <div className="col-span-5">Details</div>
        <div className="col-span-3">Questions</div>
      </div>
      <div className="space-y-2">
        {syllabusData.map(subject => (
          <div key={subject.name} className="space-y-2">
            <div className="grid grid-cols-12 gap-4 items-start py-2 border-b">
              <div className="col-span-1">
                <Button
                  variant="ghost"
                  onClick={() => toggleSubject(subject.name)}
                  className="flex items-center p-0"
                >
                  {expandedSubjects.has(subject.name) ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                  {subject.name}
                </Button>
              </div>
              <div className="col-span-11"></div>
            </div>
            {expandedSubjects.has(subject.name) && subject.topics.map(topic => (
              <div key={topic.name} className="space-y-2 ml-4">
                <div className="grid grid-cols-12 gap-4 items-start py-2 border-b">
                  <div className="col-span-1"></div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      onClick={() => toggleTopic(topic.name)}
                      className="flex items-center p-0"
                    >
                      {expandedTopics.has(topic.name) ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                      {topic.name}
                    </Button>
                  </div>
                  <div className="col-span-2"></div>
                  <div className="col-span-5">{topic.details}</div>
                  <div className="col-span-3"></div>
                </div>
                {expandedTopics.has(topic.name) && topic.concepts.map(concept => (
                  <div key={concept.name} className="space-y-2 ml-4">
                    <div className="grid grid-cols-12 gap-4 items-start py-2 border-b">
                      <div className="col-span-1"></div>
                      <div className="col-span-1"></div>
                      <div className="col-span-2">
                        <Button
                          variant="ghost"
                          onClick={() => toggleConcept(concept.name)}
                          className="flex items-center p-0"
                        >
                          {expandedConcepts.has(concept.name) ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                          {concept.name}
                        </Button>
                      </div>
                      <div className="col-span-5">
                        <p>{concept.details}</p>
                        {concept.codeExample && (
                          <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="mt-2">
                            {concept.codeExample}
                          </SyntaxHighlighter>
                        )}
                      </div>
                      <div className="col-span-3">
                        {expandedConcepts.has(concept.name) && concept.questions.map((question, index) => (
                          <div key={index} className="mb-4">
                            <strong>Q:</strong> {question.question}
                            {question.questionCode && (
                              <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="mt-2 text-sm">
                                {question.questionCode}
                              </SyntaxHighlighter>
                            )}
                            <br />
                            <strong>A:</strong> {question.answer}
                            {question.answerCode && (
                              <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="mt-2 text-sm">
                                {question.answerCode}
                              </SyntaxHighlighter>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}