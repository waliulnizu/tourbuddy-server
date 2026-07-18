import { Request, Response } from 'express';
import About from '../models/About';

export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const about = await About.findOne();
    res.json({ about });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, des } = req.body;
    let about = await About.findOne();
    if (!about) {
      about = new About({ title, des });
    } else {
      if (title) about.title = title;
      if (des) about.des = des;
      if (req.file) about.about_image = (req.file as Express.Multer.File).path;
      else if (req.body.about_image) about.about_image = req.body.about_image;
    }
    await about.save();
    res.json({ message: 'About updated successfully', about });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
