import { Request, Response } from 'express';
import Apply from '../models/Apply';

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await Apply.find().sort({ _id: -1 });
    res.json({ applications });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const app = await Apply.findById(req.params.id);
    if (!app) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    app.status = req.body.status || (app.status === 'active' ? 'deactive' : 'active');
    await app.save();
    res.json({ message: 'Application status updated', application: app });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const app = await Apply.findByIdAndDelete(req.params.id);
    if (!app) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
