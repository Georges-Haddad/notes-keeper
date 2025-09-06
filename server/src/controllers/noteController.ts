import { Request, Response } from 'express';
import Note from '../models/Note';
import { AuthRequest } from '../middleware/authMiddleware';

//  Get all notes for logged in user
//  GET /notes
export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ user: req.user!.id }).sort({ pinned: -1, createdAt: -1 }); 
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new note
// POST /notes
export const createNote = async (req: AuthRequest, res: Response) => {
  const { title, content, color } = req.body;

  try {
    const note = new Note({
      title,
      content,
      color: color || 'yellow',
      user: req.user!.id,
    });

    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

//Update a note
//  PUT /notes/:id
export const updateNote = async (req: AuthRequest, res: Response) => {
  const { title, content, color } = req.body;

  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns the note
    if (note.user.toString() !== req.user!.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.color = color || note.color;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a note
//  DELETE /notes/:id
export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check ownership
    if (note.user.toString() !== req.user!.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};