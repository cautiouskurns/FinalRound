import React, { useState } from 'react';

export default function AddUserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('User added successfully');
        setName('');
        setEmail('');
      } else {
        alert(`Failed to add user: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('An error occurred while adding the user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button type="submit">Add User</button>
    </form>
  );
}