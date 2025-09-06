// server/src/controllers/authController.ts

import { Request, Response } from 'express';
import User, { IUser } from '../models/User'; 
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    let user: IUser | null = await User.findOne({ email });// 👈 Typed as IUser
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.status(201).json({ token, userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email }); 
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.json({ token, userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};