'use client'

import { useState, useEffect, FormEvent } from 'react'

interface Concept {
  id: number;
  name: string;
  details: string;
}

export function ConceptTest() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newConcept, setNewConcept] = useState({ name: '', details: '' });

  const fetchConcepts = async () => {
    try {
      const response = await fetch('/api/test-concepts');
      if (!response.ok) {
        throw new Error('Failed to fetch concepts');
      }
      const data = await response.json();
      setConcepts(data);
    } catch (error) {
      console.error('Error fetching concepts:', error);
      setError('Failed to load concepts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConcepts();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
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
      setNewConcept({ name: '', details: '' });
      fetchConcepts();
    } catch (error) {
      console.error('Error adding concept:', error);
      setError('Failed to add concept. Please try again.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Concepts</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
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
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Concept</button>
      </form>

      {concepts.length === 0 ? (
        <p>No concepts found.</p>
      ) : (
        <ul className="space-y-4">
          {concepts.map((concept) => (
            <li key={concept.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{concept.name}</h2>
              <p className="mt-2">{concept.details}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}