'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from 'framer-motion'

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
  codeExample?: string
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
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const [expandedConcepts, setExpandedConcepts] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/data/syllabus.json')
      .then(response => response.json())
      .then(data => {
        setSyllabusData(data)
        if (data.length > 0) {
          setSelectedSubject(data[0].name)
        }
      })
  }, [])

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

  const navigateToTopicPage = (topic: Topic) => {
    // Implement navigation to topic page
    console.log("Navigate to topic page:", topic.name);
  }

  const navigateToConceptPage = (concept: Concept) => {
    // Implement navigation to concept page
    console.log("Navigate to concept page:", concept.name);
  }

  const selectedSubjectData = syllabusData.find(subject => subject.name === selectedSubject)

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Interview Syllabus</h2>
      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
        <SelectTrigger className="w-[180px] mb-4">
          <SelectValue placeholder="Select a subject" />
        </SelectTrigger>
        <SelectContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {syllabusData.map(subject => (
              <SelectItem key={subject.name} value={subject.name}>
                {subject.name}
              </SelectItem>
            ))}
          </motion.div>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-11 gap-4 font-bold mb-2 border-b pb-2">
        <div className="col-span-1">Topic</div>
        <div className="col-span-2">Concept</div>
        <div className="col-span-5">Details</div>
        <div className="col-span-3">Questions</div>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {selectedSubjectData && selectedSubjectData.topics.map(topic => (
            <motion.div 
              key={topic.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <div className="grid grid-cols-11 gap-4 items-start py-2 border-b">
                <div className="col-span-1 flex items-center">
                  <Button
                    variant="ghost"
                    onClick={() => toggleTopic(topic.name)}
                    className="p-1 mr-2"
                  >
                    {expandedTopics.has(topic.name) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigateToTopicPage(topic)}
                    className="p-0"
                  >
                    {topic.name}
                  </Button>
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-5">{topic.details}</div>
                <div className="col-span-3"></div>
              </div>
              <AnimatePresence>
                {expandedTopics.has(topic.name) && topic.concepts.map(concept => (
                  <motion.div
                    key={concept.name}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 ml-4"
                  >
                    <div className="grid grid-cols-11 gap-4 items-start py-2 border-b">
                      <div className="col-span-1"></div>
                      <div className="col-span-2 flex items-center">
                        <Button
                          variant="ghost"
                          onClick={() => toggleConcept(concept.name)}
                          className="p-1 mr-2"
                        >
                          {expandedConcepts.has(concept.name) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => navigateToConceptPage(concept)}
                          className="p-0"
                        >
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
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="mb-4"
                          >
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
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}