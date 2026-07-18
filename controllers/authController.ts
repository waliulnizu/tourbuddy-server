import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      phone
    });

    await user.save();

    const payload = { userId: String(user._id), role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: String(user._id), name, email, role: user.role } });
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const payload = { userId: String(user._id), role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });

    res.json({ token, user: { id: String(user._id), name: user.name, email, role: user.role } });
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server Error' });
  }
};
