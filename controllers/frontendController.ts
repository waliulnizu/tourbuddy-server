import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Post from '../models/Post';
import Blog from '../models/Blog';
import Banner from '../models/Banner';
import BannerText from '../models/BannerText';
import Slider from '../models/Slider';
import User from '../models/User';
import About from '../models/About';
import Guide from '../models/Guide';
import Contact from '../models/Contact';
import Connect from '../models/Connect';
import Rating from '../models/Rating';

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find({ status: 'active' })
      .populate('traveler', 'name')
      .sort({ _id: -1 })
      .limit(12);

    const blogs = await Blog.find({ status: 'active' })
      .sort({ _id: -1 })
      .limit(3);

    const banners = await Banner.find();
    const bannertext = await BannerText.findOne();
    const sliders = await Slider.find();

    res.json({ bannertext, banners, posts, sliders, blogs });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const singlepost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id).populate('traveler', '_id name');
    const connects = await Connect.find({ post: req.params.id }).populate('traveler', 'name profilePicture');

    let myConnect = null;
    const header = req.header('Authorization');
    if (header) {
      try {
        const token = header.startsWith('Bearer ') ? header.slice(7) : header;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as { userId: string };
        myConnect = await Connect.findOne({ post: req.params.id, traveler: decoded.userId });
      } catch { /* token invalid, ignore */ }
    }

    res.json({ post, connects, myConnect });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const singleblog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id).populate('traveler', 'name');
    res.json({ blog });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const allpost = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: Record<string, unknown> = { status: 'active' };

    if (req.query.budget) query.amount = req.query.budget;

    const posts = await Post.find(query).populate('traveler', 'name').sort({ _id: -1 });
    res.json({ posts });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const allBlogPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find({ status: 'active' }).populate('traveler', 'name').sort({ _id: -1 });
    res.json({ blogs });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const about = async (req: Request, res: Response): Promise<void> => {
  try {
    const aboutData = await About.findOne();
    const guides = await Guide.find({ status: 'active' }).sort({ _id: -1 });
    res.json({ about: aboutData, guides });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const contact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contactData = await Contact.findOne();
    res.json({ contact: contactData });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchData = (req.query.q as string) || '';
    const posts = await Post.find({
      status: 'active',
      $or: [
        { title: { $regex: searchData, $options: 'i' } },
        { details: { $regex: searchData, $options: 'i' } }
      ]
    }).populate('traveler', 'name').sort({ _id: -1 });
    res.json({ posts });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const travelers = async (req: Request, res: Response): Promise<void> => {
  try {
    const traveler = await User.findById(req.params.id);

    const ratings = await Rating.find({ member: req.params.id });
    const star_total = ratings.length;
    let sum = 0;
    ratings.forEach(r => sum += r.rating);
    const percentage = star_total > 0 ? (sum / star_total) * 20 : 0;

    res.json({ traveler, percentage, star_total });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const members = async (req: Request, res: Response): Promise<void> => {
  try {
    const all_members = await User.find({ status: 'active', role: 'traveler' }).sort({ _id: -1 });
    res.json({ all_members });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
