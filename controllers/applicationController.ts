import { Response } from 'express';
import Apply from '../models/Apply';
import Guide from '../models/Guide';
import User from '../models/User';
import { AuthRequest } from '../types';

export const index = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Apply.find().sort({ _id: -1 });
    res.json({ applications });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const app = await Apply.findById(req.params.id);
    if (!app) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    const newStatus = req.body.status || (app.status === 'approved' ? 'pending' : 'approved');
    app.status = newStatus;
    await app.save();

    // Auto-create Guide when approved
    if (newStatus === 'approved') {
      const existingGuide = await Guide.findOne({ phone: app.phone });
      if (!existingGuide) {
        // Use latest user profile picture if available
        const user = app.user ? await User.findById(app.user) : null;
        const profilePic = user?.profilePicture || app.profile_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
        const guideData: any = {
          name: app.name,
          email: app.email,
          phone: app.phone,
          address: app.address || '',
          bio: app.bio || '',
          experience: app.experience || '',
          guide_image: profilePic,
          status: 'active',
        };
        await Guide.create(guideData);
      }
      if (app.user) {
        await User.findByIdAndUpdate(app.user, { role: 'guide' });
      }
    }

    res.json({ message: 'Application status updated', application: app });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const destroy = async (req: AuthRequest, res: Response): Promise<void> => {
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
