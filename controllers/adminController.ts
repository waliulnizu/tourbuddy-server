import { Response } from 'express';
import bcrypt from 'bcryptjs';
import Post from '../models/Post';
import User from '../models/User';
import Guide from '../models/Guide';
import { AuthRequest } from '../types';

export const dashboardIndex = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalPost = await Post.countDocuments({ status: 'active' });
    const totalPendingPost = await Post.countDocuments({ status: 'pending' });
    const totalPendingGuide = await Guide.countDocuments({ status: 'deactive' });
    const totalTraveler = await User.countDocuments({ role: 'traveler' });

    res.json({ totalPost, totalPendingPost, totalPendingGuide, totalTraveler });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const allPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await Post.find().populate('traveler', 'name');
    res.json({ posts });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const pendingPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await Post.find({ status: 'pending' }).populate('traveler', 'name');
    res.json({ posts });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const activePosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await Post.find({ status: 'active' }).populate('traveler', 'name');
    res.json({ posts });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const viewPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id).populate('traveler', 'name');
    res.json({ post });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const acceptPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    post.status = 'active';
    await post.save();
    res.json({ message: 'Post activated successfully', post });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const allTravelers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const travelers = await User.find({ role: 'traveler' });
    res.json({ travelers });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const addUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, address, status, role, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      phone,
      address,
      status: status || 'active',
      role: role || 'admin',
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
