'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"

interface Concept {
  name: string
  details: string
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

const syllabusData: Subject[] = [
  {
    name: 'JavaScript',
    topics: [
      {
        name: 'Basics',
        details: 'Fundamental concepts of JavaScript programming',
        concepts: [
          { name: 'Variables', details: 'Declaring and using variables' },
          { name: 'Data Types', details: 'Understanding different data types in JavaScript' },
          { name: 'Functions', details: 'Creating and using functions' },
          { name: 'Objects', details: 'Working with JavaScript objects' }
        ]
      },
      {
        name: 'Advanced',
        details: 'Advanced JavaScript concepts and features',
        concepts: [
          { name: 'Closures', details: 'Understanding and using closures' },
          { name: 'Promises', details: 'Working with asynchronous operations using Promises' },
          { name: 'Async/Await', details: 'Using async/await for asynchronous programming' },
          { name: 'ES6+ Features', details: 'Modern JavaScript features introduced in ES6 and beyond' }
        ]
      }
    ]
  },
  {
    name: 'React',
    topics: [
      {
        name: 'Fundamentals',
        details: 'Core concepts of React',
        concepts: [
          { name: 'Components', details: 'Creating and using React components' },
          { name: 'JSX', details: 'Writing JSX syntax' },
          { name: 'Props', details: 'Passing and using props in components' },
          { name: 'State', details: 'Managing component state' }
        ]
      },
      {
        name: 'Hooks',
        details: 'Using React Hooks for state and side effects',
        concepts: [
          { name: 'useState', details: 'Managing state in functional components' },
          { name: 'useEffect', details: 'Handling side effects in components' },
          { name: 'useContext', details: 'Using React Context with hooks' },
          { name: 'Custom Hooks', details: 'Creating and using custom hooks' }
        ]
      }
    ]
  }
]

export function Syllabus() {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set())
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())

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

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Interview Syllabus</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6">Subject</TableHead>
            <TableHead className="w-1/6">Topic</TableHead>
            <TableHead className="w-1/6">Concept</TableHead>
            <TableHead className="w-1/2">Details</TableHead>
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
                  </TableRow>
                  {expandedTopics.has(topic.name) && topic.concepts.map(concept => (
                    <TableRow key={concept.name}>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>{concept.name}</TableCell>
                      <TableCell>{concept.details}</TableCell>
                    </TableRow>
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