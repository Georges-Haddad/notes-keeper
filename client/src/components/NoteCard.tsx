// client/src/components/NoteCard.tsx

import React from 'react';

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onPin: (id: string, pinned: boolean) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onPin }) => {
  const getBgColor = () => {
    switch (note.color) {
      case 'blue':
        return '#d4edff';
      case 'green':
        return '#d4f7d4';
      case 'pink':
        return '#ffd4eb';
      case 'orange':
        return '#ffe0c2';
      default:
        return '#fff8dc'; // yellow
    }
  };

  return (
    <div
      className="note-card"
      style={{
        backgroundColor: getBgColor(),
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'relative',
      }}
    >
      <h3 style={{ margin: '0 0 8px 0' }}>{note.title}</h3>
      <p style={{ margin: '0 0 16px 0' }}>{note.content}</p>
      <div>
        <button
          onClick={() => onEdit(note)}
          style={{ marginRight: '8px' }}
          className="btn btn-primary"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
        <button
        onClick={() => onPin(note._id, !note.pinned)}
        style={{
            marginLeft: '8px',
            backgroundColor: note.pinned ? '#ffc107' : '#e9ecef',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: 'pointer',
        }}
        >
        {note.pinned ? '📌' : '◻️'}
        </button>
      </div>
    </div>
  );
};

export default NoteCard;