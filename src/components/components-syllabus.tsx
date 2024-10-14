'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from 'framer-motion'
import { ConceptTopicPage } from './ConceptTopicPage';
import { Link } from 'next/link';

export interface Concept {
  id: number;
  name: string;
  details: string;
  code_example?: string;
}

export interface Topic {
  id: number;
  name: string;
  details: string;
  concepts: Concept[];
}

export interface Subject {
  id: number;
  name: string;
  topics: Topic[];
}

export interface Question {
  question: string;
  answer: string;
}

export function Syllabus() {
  const [syllabusData, setSyllabusData] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const [expandedConcepts, setExpandedConcepts] = useState<Set<string>>(new Set())
  const [selectedItem, setSelectedItem] = useState<Topic | Concept | null>(null);

  useEffect(() => {
    fetchSyllabusData();
  }, [])

  const fetchSyllabusData = async () => {
    try {
      const response = await fetch('/api/syllabus');
      if (!response.ok) {
        throw new Error('Failed to fetch syllabus data');
      }
      const data = await response.json();
      setSyllabusData(data);
      if (data.length > 0) {
        setSelectedSubject(data[0].name);
      }
    } catch (error) {
      console.error('Error fetching syllabus data:', error);
    }
  };

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
    setSelectedItem(topic);
  }

  const navigateToConceptPage = (concept: Concept) => {
    setSelectedItem(concept);
  }

  const selectedSubjectData = syllabusData.find((subject: Subject) => subject.name === selectedSubject)

  return (
    <>
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
              {syllabusData.map((subject: Subject) => (
                <SelectItem key={subject.name} value={subject.name}>
                  {subject.name}
                </SelectItem>
              ))}
            </motion.div>
          </SelectContent>
        </Select>
        <div className="grid grid-cols-12 gap-4 font-semibold mb-2 border-b pb-2">
          <div className="col-span-3 text-lg">Topic</div>
          <div className="col-span-3 text-lg">Concept</div>
          <div className="col-span-6 text-lg">Details</div>
        </div>
        <div className="space-y-2">
          <AnimatePresence>
            {selectedSubjectData && selectedSubjectData.topics.map((topic: Topic) => (
              <motion.div 
                key={topic.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <div className="grid grid-cols-12 gap-4 items-start py-2 border-b">
                  <div className="col-span-3 flex items-center">
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
                      className="p-0 text-base font-semibold"
                    >
                      {topic.name}
                    </Button>
                  </div>
                  <div className="col-span-3"></div>
                  <div className="col-span-6 text-base">{topic.details}</div>
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
                      <div className="grid grid-cols-12 gap-4 items-start py-2 border-b">
                        <div className="col-span-3"></div>
                        <div className="col-span-3">
                          <Button
                            variant="ghost"
                            onClick={() => navigateToConceptPage(concept)}
                            className="p-0 text-base font-semibold"
                          >
                            {concept.name}
                          </Button>
                        </div>
                        <div className="col-span-6 text-base">
                          <p>{concept.details}</p>
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
      {selectedItem && (
        <ConceptTopicPage
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onBack={() => setSelectedItem(null)}
        />
      )}
    </>
  )
}

export function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/syllabus">Syllabus</Link>
        </li>
        {/* ... (other navigation items) */}
      </ul>
    </nav>
  );
}
