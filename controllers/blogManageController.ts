import { Request, Response } from 'express';
import Blog from '../models/Blog';

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find().populate('traveler', 'name').sort({ _id: -1 });
    res.json({ blogs });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }
    blog.status = req.body.status || (blog.status === 'active' ? 'pending' : 'active');
    await blog.save();
    res.json({ message: 'Blog status updated', blog });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
