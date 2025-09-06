// client/src/components/NoteForm.tsx

import React, { useState } from 'react';
import ColorPicker from './ColorPicker';

interface NoteFormProps {
  onSubmit: (note: { title: string; content: string; color: string }) => void;
  initialData?: {
    title: string;
    content: string;
    color: string;
  };
  onCancel?: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [color, setColor] = useState(initialData?.color || 'yellow');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title, content, color });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="form-input"
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="form-input"
        rows={4}
        required
      />
      <ColorPicker value={color} onChange={setColor} />
      <div style={{ marginTop: '16px' }}>
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update Note' : 'Create Note'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{ marginLeft: '8px' }}
            className="btn"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default NoteForm;