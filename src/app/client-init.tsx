'use client'

import { useEffect } from 'react';

export default function ClientInit() {
  useEffect(() => {
    fetch('/api/init-db')
      .then(response => response.json())
      .then(data => console.log('Database initialization:', data))
      .catch(error => console.error('Database initialization error:', error));
  }, []);

  return null; // This component doesn't render anything
}