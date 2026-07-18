import { Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../types';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const notifications = await Notification.find({ user: userId, type: { $ne: 'message' } })
      .populate('fromUser', 'name profilePicture')
      .populate('post', 'title image')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ notifications });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const getUnreadNotificationCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const count = await Notification.countDocuments({ user: userId, read: false, type: { $ne: 'message' } });
    res.json({ count });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (id === 'all') {
      await Notification.updateMany({ user: userId, read: false }, { $set: { read: true } });
    } else {
      await Notification.findOneAndUpdate({ _id: id, user: userId }, { $set: { read: true } });
    }

    res.json({ message: 'Marked as read' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    await Notification.findOneAndDelete({ _id: id, user: userId });
    res.json({ message: 'Notification deleted' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
