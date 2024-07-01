import { useEffect, useState } from 'react';

function Home() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/notes')
      .then(response => response.json())
      .then(data => setNotes(data));
  }, []);

  const handleAdd = () => {
    fetch('http://localhost:3000/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newNote })
    }).then(response => response.json())
      .then(note => setNotes([...notes, note]));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/notes/${id}`, { method: 'DELETE' })
      .then(() => setNotes(notes.filter(note => note.id !== id)));
  };

  return (
    <div>
      <h1>Home</h1>
      <input value={newNote} onChange={e => setNewNote(e.target.value)} />
      <button onClick={handleAdd}>Add Note</button>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            {note.text}
            <button onClick={() => handleDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
