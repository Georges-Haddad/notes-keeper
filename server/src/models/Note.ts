// server/src/models/Note.ts

import mongoose, { Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  color: string; // e.g., 'yellow', 'blue', 'green'
  user: mongoose.Types.ObjectId; // Reference to User
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new mongoose.Schema<INote>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
      default: 'yellow',
      enum: ['yellow', 'blue', 'green', 'pink', 'orange'], // optional: restrict colors
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pinned: {
    type: Boolean,
    default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<INote>('Note', noteSchema);