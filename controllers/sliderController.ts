import { Request, Response } from 'express';
import Slider from '../models/Slider';

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const sliders = await Slider.find().sort({ _id: -1 });
    res.json({ sliders });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const store = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slider_title, slider_slugan, status } = req.body;
    const slider_image = req.file ? (req.file as Express.Multer.File).path : req.body.slider_image;
    const slider = new Slider({ slider_title, slider_slugan, slider_image, status });
    await slider.save();
    res.status(201).json({ message: 'Slider created successfully', slider });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      res.status(404).json({ message: 'Slider not found' });
      return;
    }
    if (req.body.slider_title) slider.slider_title = req.body.slider_title;
    if (req.body.slider_slugan) slider.slider_slugan = req.body.slider_slugan;
    if (req.body.status) slider.status = req.body.status;
    if (req.file) slider.slider_image = (req.file as Express.Multer.File).path;
    else if (req.body.slider_image) slider.slider_image = req.body.slider_image;
    await slider.save();
    res.json({ message: 'Slider updated successfully', slider });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const slider = await Slider.findByIdAndDelete(req.params.id);
    if (!slider) {
      res.status(404).json({ message: 'Slider not found' });
      return;
    }
    res.json({ message: 'Slider deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
