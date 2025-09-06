// client/src/pages/Dashboard.tsx

import  { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  

    const fetchNotes = useCallback(async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/notes`, {
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
        });

        if (!res.ok) throw new Error('Failed to fetch notes');

        const data = await res.json();
        setNotes(data);
        setLoading(false);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred (fetch notes)');
        }
        setLoading(false);
    }
    }, [user?.token]);


    useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchNotes();
  }, [user, navigate, fetchNotes]);



  const handleCreateNote = async (noteData: {
    title: string;
    content: string;
    color: string;
  }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(noteData),
      });

      if (!res.ok) throw new Error('Failed to create note');

      const newNote = await res.json();
      setNotes([newNote, ...notes]);
      setEditingNote(null); // Reset form
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred (create note)');
      }
    }
  };

  const handleUpdateNote = async (noteData: { title: string; content: string; color: string }) => {
    if (!editingNote) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/notes/${editingNote._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(noteData),
        }
      );

      if (!res.ok) throw new Error('Failed to update note');

      const savedNote = await res.json();
      setNotes(
        notes.map((note) => (note._id === savedNote._id ? savedNote : note))
      );
      setEditingNote(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred (update note)');
      }
    }
  };


  const handlePinNote = async (id: string, pinned: boolean) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ pinned }), // 👈 Only send pinned field
    });

    if (!res.ok) throw new Error('Failed to update note');

    const updatedNote = await res.json();
    setNotes(
      notes.map((note) => (note._id === updatedNote._id ? updatedNote : note))
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unknown error occurred (pin note)');
    }
  }
};

  const handleDeleteNote = async (id: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete note');

      setNotes(notes.filter((note) => note._id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred (delete note)');
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Your Notes</h2>
        <button onClick={logout} className="btn btn-danger">
          Logout
        </button>
        <button
        onClick={() => setDarkMode(!darkMode)}
        className="btn"
        style={{ marginLeft: '16px' }}
        >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Create/Edit Form */}
      <NoteForm
        onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
        initialData={editingNote || undefined}
        onCancel={() => setEditingNote(null)}
      />

      <input
        type="text"
        placeholder="Search notes by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-input"
        style={{ marginBottom: '20px', maxWidth: '400px' }}
        />

      {/* Notes Grid */}
      <div className="notes-grid">
        {notes.length === 0 ? (
          <p>No notes yet. Create one above!</p>
        ) : (
          notes
            .filter((note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
          .map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={setEditingNote}
              onDelete={handleDeleteNote}
              onPin={handlePinNote}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;