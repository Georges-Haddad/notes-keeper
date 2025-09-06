// server/src/routes/noteRoutes.ts

import { Router } from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.route('/').get(protect, getNotes).post(protect, createNote);
router.route('/:id').put(protect, updateNote).delete(protect, deleteNote);

export default router;