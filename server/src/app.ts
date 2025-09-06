// server/src/app.ts

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);

// Connect to MongoDB
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });