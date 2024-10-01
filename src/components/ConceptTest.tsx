'use client'

import { useState, useEffect, FormEvent, ChangeEvent } from 'react'

interface Concept {
  id: number;
  name: string;
  details: string;
  topic_name?: string;
  subject_name?: string;
}

interface Topic {
  id: number;
  name: string;
  details: string;
  subject_name?: string;
}

interface Subject {
  id: number;
  name: string;
  details: string;
}

export function ConceptTest() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newConcept, setNewConcept] = useState({ name: '', details: '', topic_id: '' });
  const [newTopic, setNewTopic] = useState({ name: '', details: '', subject_id: '' });
  const [newSubject, setNewSubject] = useState({ name: '', details: '' });
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);

  const fetchData = async () => {
    try {
      const conceptsResponse = await fetch('/api/test-concepts');
      const topicsResponse = await fetch('/api/test-concepts?type=topics');
      const subjectsResponse = await fetch('/api/test-concepts?type=subjects');
      if (!conceptsResponse.ok || !topicsResponse.ok || !subjectsResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      const conceptsData = await conceptsResponse.json();
      const topicsData = await topicsResponse.json();
      const subjectsData = await subjectsResponse.json();
      setConcepts(conceptsData);
      setTopics(topicsData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConceptSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add-concept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConcept),
      });
      if (!response.ok) {
        throw new Error('Failed to add concept');
      }
      setNewConcept({ name: '', details: '', topic_id: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding concept:', error);
      setError('Failed to add concept. Please try again.');
    }
  };

  const handleTopicSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add-topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTopic),
      });
      if (!response.ok) {
        throw new Error('Failed to add topic');
      }
      setNewTopic({ name: '', details: '', subject_id: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding topic:', error);
      setError('Failed to add topic. Please try again.');
    }
  };

  const handleSubjectSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add-subject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubject),
      });
      if (!response.ok) {
        throw new Error('Failed to add subject');
      }
      setNewSubject({ name: '', details: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding subject:', error);
      setError('Failed to add subject. Please try again.');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSyllabusFile(e.target.files[0]);
    }
  };

  const handleSyllabusImport = async (e: FormEvent) => {
    e.preventDefault();
    if (!syllabusFile) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        try {
          const syllabusData = JSON.parse(text);
          const response = await fetch('/api/import-syllabus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(syllabusData),
          });
          if (!response.ok) {
            throw new Error('Failed to import syllabus');
          }
          alert('Syllabus imported successfully');
          fetchData();
        } catch (error) {
          console.error('Error importing syllabus:', error);
          setError('Failed to import syllabus. Please try again.');
        }
      }
    };
    reader.readAsText(syllabusFile);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Subjects, Topics, and Concepts</h1>
      
      <form onSubmit={handleSyllabusImport} className="mb-8">
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-purple-500 text-white p-2 rounded">Import Syllabus</button>
      </form>

      <form onSubmit={handleSubjectSubmit} className="mb-8">
        <input
          type="text"
          value={newSubject.name}
          onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
          placeholder="Subject Name"
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          value={newSubject.details}
          onChange={(e) => setNewSubject({ ...newSubject, details: e.target.value })}
          placeholder="Subject Details"
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-purple-500 text-white p-2 rounded">Add Subject</button>
      </form>

      <form onSubmit={handleTopicSubmit} className="mb-8">
        <input
          type="text"
          value={newTopic.name}
          onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
          placeholder="Topic Name"
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          value={newTopic.details}
          onChange={(e) => setNewTopic({ ...newTopic, details: e.target.value })}
          placeholder="Topic Details"
          className="border p-2 mr-2"
          required
        />
        <select
          value={newTopic.subject_id}
          onChange={(e) => setNewTopic({ ...newTopic, subject_id: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Add Topic</button>
      </form>

      <form onSubmit={handleConceptSubmit} className="mb-8">
        <input
          type="text"
          value={newConcept.name}
          onChange={(e) => setNewConcept({ ...newConcept, name: e.target.value })}
          placeholder="Concept Name"
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          value={newConcept.details}
          onChange={(e) => setNewConcept({ ...newConcept, details: e.target.value })}
          placeholder="Concept Details"
          className="border p-2 mr-2"
          required
        />
        <select
          value={newConcept.topic_id}
          onChange={(e) => setNewConcept({ ...newConcept, topic_id: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Select Topic</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>{topic.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Concept</button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Subjects</h2>
      {subjects.length === 0 ? (
        <p>No subjects found.</p>
      ) : (
        <ul className="space-y-4 mb-8">
          {subjects.map((subject) => (
            <li key={subject.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold">{subject.name}</h3>
              <p className="mt-2">{subject.details}</p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-semibold mb-2">Topics</h2>
      {topics.length === 0 ? (
        <p>No topics found.</p>
      ) : (
        <ul className="space-y-4 mb-8">
          {topics.map((topic) => (
            <li key={topic.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold">{topic.name}</h3>
              <p className="mt-2">{topic.details}</p>
              {topic.subject_name && <p className="mt-2 text-sm text-gray-600">Subject: {topic.subject_name}</p>}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-semibold mb-2">Concepts</h2>
      {concepts.length === 0 ? (
        <p>No concepts found.</p>
      ) : (
        <ul className="space-y-4">
          {concepts.map((concept) => (
            <li key={concept.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold">{concept.name}</h3>
              <p className="mt-2">{concept.details}</p>
              {concept.topic_name && <p className="mt-2 text-sm text-gray-600">Topic: {concept.topic_name}</p>}
              {concept.subject_name && <p className="mt-2 text-sm text-gray-600">Subject: {concept.subject_name}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}