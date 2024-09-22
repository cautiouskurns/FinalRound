'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"

interface Question {
  question: string
  answer: string
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6">Subject</TableHead>
            <TableHead className="w-1/6">Topic</TableHead>
            <TableHead className="w-1/6">Concept</TableHead>
            <TableHead className="w-1/3">Details</TableHead>
            <TableHead className="w-1/3">Questions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {syllabusData.map(subject => (
            <>
              <TableRow key={subject.name}>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSubject(subject.name)}
                    className="flex items-center p-0"
                  >
                    {expandedSubjects.has(subject.name) ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                    {subject.name}
                  </Button>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              {expandedSubjects.has(subject.name) && subject.topics.map(topic => (
                <>
                  <TableRow key={topic.name}>
                    <TableCell></TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() => toggleTopic(topic.name)}
                        className="flex items-center p-0"
                      >
                        {expandedTopics.has(topic.name) ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                        {topic.name}
                      </Button>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>{topic.details}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  {expandedTopics.has(topic.name) && topic.concepts.map(concept => (
                    <>
                      <TableRow key={concept.name}>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            onClick={() => toggleConcept(concept.name)}
                            className="flex items-center p-0"
                          >
                            {expandedConcepts.has(concept.name) ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                            {concept.name}
                          </Button>
                        </TableCell>
                        <TableCell>{concept.details}</TableCell>
                        <TableCell>
                          {expandedConcepts.has(concept.name) && concept.questions.map((question, index) => (
                            <div key={index}>
                              <strong>Q:</strong> {question.question}<br />
                              <strong>A:</strong> {question.answer}<br />
                            </div>
                          ))}
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}