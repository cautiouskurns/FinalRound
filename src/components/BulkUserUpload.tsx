import React, { useState } from 'react';

export default function BulkUserUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    try {
      const content = await file.text();
      const users = JSON.parse(content);

      const response = await fetch('/api/bulk-upload-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(users),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Users uploaded successfully');
      } else {
        alert(`Failed to upload users: ${data.message}`);
      }
    } catch (error) {
      console.error('Error uploading users:', error);
      alert('An error occurred while uploading users');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} accept=".json" />
      <button type="submit">Upload Users</button>
    </form>
  );
}