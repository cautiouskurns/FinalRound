'use client'

import { useState, useEffect } from 'react'
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

export function Syllabus() {
  const [syllabusData, setSyllabusData] = useState<Subject[]>([])
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set())
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())

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