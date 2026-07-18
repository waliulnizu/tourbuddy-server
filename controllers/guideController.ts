import { Request, Response } from 'express';
import Guide from '../models/Guide';

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const guides = await Guide.find().sort({ _id: -1 });
    res.json({ guides });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const store = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, designation, phone, status } = req.body;
    const guide_image = req.file ? `uploads/${(req.file as Express.Multer.File).filename}` : req.body.guide_image;
    const guide = new Guide({ name, designation, phone, guide_image, status });
    await guide.save();
    res.status(201).json({ message: 'Guide created successfully', guide });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      res.status(404).json({ message: 'Guide not found' });
      return;
    }
    if (req.body.name) guide.name = req.body.name;
    if (req.body.designation) guide.designation = req.body.designation;
    if (req.body.phone) guide.phone = req.body.phone;
    if (req.body.status) guide.status = req.body.status;
    if (req.file) guide.guide_image = (req.file as Express.Multer.File).path;
    else if (req.body.guide_image) guide.guide_image = req.body.guide_image;
    await guide.save();
    res.json({ message: 'Guide updated successfully', guide });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const guide = await Guide.findByIdAndDelete(req.params.id);
    if (!guide) {
      res.status(404).json({ message: 'Guide not found' });
      return;
    }
    res.json({ message: 'Guide deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
