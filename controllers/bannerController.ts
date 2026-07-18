import { Request, Response } from 'express';
import Banner from '../models/Banner';

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const banners = await Banner.find().sort({ _id: -1 });
    res.json({ banners });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const store = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    const image = req.file ? (req.file as Express.Multer.File).path : req.body.image;
    const banner = new Banner({ title, image });
    await banner.save();
    res.status(201).json({ message: 'Banner created successfully', banner });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      res.status(404).json({ message: 'Banner not found' });
      return;
    }
    if (req.body.title) banner.title = req.body.title;
    if (req.file) banner.image = (req.file as Express.Multer.File).path;
    else if (req.body.image) banner.image = req.body.image;
    await banner.save();
    res.json({ message: 'Banner updated successfully', banner });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      res.status(404).json({ message: 'Banner not found' });
      return;
    }
    res.json({ message: 'Banner deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
