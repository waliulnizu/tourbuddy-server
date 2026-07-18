import { Request, Response } from 'express';
import Apply from '../models/Apply';

export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone } = req.body;
    const apply = new Apply({
      name,
      email,
      phone,
      cv: req.body.cv || ''
    });
    await apply.save();
    res.status(201).json({ message: 'Application submitted successfully', apply });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await Apply.find().sort({ _id: -1 });
    res.json({ applications });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
