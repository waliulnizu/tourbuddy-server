import { Response } from 'express';
import bcrypt from 'bcryptjs';
import Post from '../models/Post';
import Blog from '../models/Blog';
import User from '../models/User';
import { AuthRequest } from '../types';

export const travelerDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const travelerId = req.user?.userId;
    const traveler = await User.findById(travelerId);
    res.json({ traveler });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const travelerId = req.user?.userId;
    const { name, phone, gender, address } = req.body;

    const traveler = await User.findById(travelerId);
    if (!traveler) {
      res.status(404).json({ message: 'Traveler not found' });
      return;
    }

    if (name) traveler.name = name;
    if (phone) traveler.phone = phone;
    if (gender) traveler.gender = gender;
    if (address) traveler.address = address;

    await traveler.save();
    res.json({ message: 'Profile updated successfully', traveler });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const travelerId = req.user?.userId;
    const { password } = req.body;

    if (!password || password.length < 4) {
      res.status(400).json({ message: 'Password must be at least 4 characters long' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const traveler = await User.findById(travelerId);
    if (traveler) {
      traveler.password = hashedPassword;
      await traveler.save();
    }

    res.json({ message: 'Password changed successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const myPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await Post.find({ traveler: req.user?.userId }).sort({ _id: -1 });
    res.json({ posts });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

// ✅ ফিক্সড: সরাসরি req.body থেকে image নিয়ে সেভ করা হচ্ছে
export const savePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, amount, phone, gender, date_to, date_from, place_from, place_to, details, image } = req.body;

    const post = new Post({
      title,
      amount,
      contact: phone,
      gender,
      date_to,
      date_from,
      place_from,
      place_to,
      details,
      traveler: req.user?.userId,
      image: image || null // ফ্রন্টএন্ড থেকে পাঠানো ImgBB URL সরাসরি সেভ হবে
    });

    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

// ✅ ফিক্সড: সরাসরি req.body থেকে image নিয়ে আপডেট করা হচ্ছে
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, amount, phone, gender, date_to, date_from, place_from, place_to, details, image } = req.body;

    const post = await Post.findOne({ _id: req.params.id, traveler: req.user?.userId });
    if (!post) {
      res.status(404).json({ message: 'Post not found or unauthorized' });
      return;
    }

    post.title = title || post.title;
    post.amount = amount || post.amount;
    post.contact = phone || post.contact;
    post.gender = gender || post.gender;
    post.date_to = date_to || post.date_to;
    post.date_from = date_from || post.date_from;
    post.place_from = place_from || post.place_from;
    post.place_to = place_to || post.place_to;
    post.details = details || post.details;
    
    // নতুন ইমেজ URL আসলে সেটি আপডেট হবে, না আসলে আগেরটাই থাকবে
    if (image !== undefined) post.image = image;

    await post.save();
    res.json({ message: 'Post updated successfully', post });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, traveler: req.user?.userId });
    if (!post) {
      res.status(404).json({ message: 'Post not found or unauthorized' });
      return;
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const myBlogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find({ traveler: req.user?.userId }).sort({ _id: -1 });
    res.json({ blogs });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const saveBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, details } = req.body;

    const blog = new Blog({
      title,
      details,
      traveler: req.user?.userId,
      status: 'active'
    });

    await blog.save();
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const updateBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, details } = req.body;

    const blog = await Blog.findOne({ _id: req.params.id, traveler: req.user?.userId });
    if (!blog) {
      res.status(404).json({ message: 'Blog not found or unauthorized' });
      return;
    }

    blog.title = title || blog.title;
    blog.details = details || blog.details;

    await blog.save();
    res.json({ message: 'Blog updated successfully', blog });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, traveler: req.user?.userId });
    if (!blog) {
      res.status(404).json({ message: 'Blog not found or unauthorized' });
      return;
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const deleteTraveler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const traveler = await User.findByIdAndDelete(req.params.id);
    if (!traveler) {
      res.status(404).json({ message: 'Traveler not found' });
      return;
    }
    res.json({ message: 'Traveler deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};