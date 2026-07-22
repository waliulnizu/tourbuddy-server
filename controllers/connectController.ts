import { Response } from 'express';
import Connect from '../models/Connect';
import Post from '../models/Post';
import Notification from '../models/Notification';
import User from '../models/User';
import { AuthRequest } from '../types';

export const requestJoin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const travelerId = req.user?.userId;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Tour not found' });
      return;
    }

    if (String(post.traveler) === travelerId) {
      res.status(400).json({ message: 'You cannot join your own tour' });
      return;
    }

    // Gender check: post er gender requirement onujayi join korte parbe
    if (post.gender && post.gender !== 'any') {
      const user = await User.findById(travelerId).select('gender');
      if (!user || user.gender !== post.gender) {
        res.status(403).json({ message: `This tour is only for ${post.gender} members` });
        return;
      }
    }

    const existing = await Connect.findOne({ post: postId, traveler: travelerId });
    if (existing) {
      res.status(400).json({ message: 'You have already requested to join this tour' });
      return;
    }

    const connect = new Connect({
      post: postId,
      traveler: travelerId,
      status: 'pending'
    });

    await connect.save();

    const senderUser = await User.findById(travelerId).select('name');
    await Notification.create({
      user: post.traveler,
      fromUser: travelerId,
      type: 'join_request',
      post: postId,
      connect: connect._id,
      text: `${senderUser?.name || 'Someone'} wants to join your tour "${post.title}"`,
      link: `/post/${postId}`
    });

    res.status(201).json({ message: 'Join request sent successfully', connect });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const cancelJoin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const travelerId = req.user?.userId;
    const postId = req.params.postId;

    const connect = await Connect.findOneAndDelete({ post: postId, traveler: travelerId });
    if (!connect) {
      res.status(404).json({ message: 'Join request not found' });
      return;
    }

    res.json({ message: 'Join request cancelled' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const approveConnect = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const travelerId = req.user?.userId;
    const connectId = req.params.connectId;

    const connect = await Connect.findById(connectId).populate('post', 'traveler');
    if (!connect) {
      res.status(404).json({ message: 'Connect request not found' });
      return;
    }

    const post = await Post.findById(connect.post);
    if (!post || String(post.traveler) !== travelerId) {
      res.status(403).json({ message: 'Only the tour host can approve requests' });
      return;
    }

    connect.status = 'approved';
    await connect.save();

    const postTitle = (connect.post as unknown as { title?: string })?.title || 'your tour';
    await Notification.create({
      user: connect.traveler,
      fromUser: travelerId,
      type: 'approved',
      post: connect.post,
      connect: connect._id,
      text: `Your request to join "${postTitle}" has been approved!`,
      link: `/post/${connect.post}`
    });

    res.json({ message: 'Join request approved', connect });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const rejectConnect = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const travelerId = req.user?.userId;
    const connectId = req.params.connectId;

    const connect = await Connect.findById(connectId).populate('post', 'traveler');
    if (!connect) {
      res.status(404).json({ message: 'Connect request not found' });
      return;
    }

    const post = await Post.findById(connect.post);
    if (!post || String(post.traveler) !== travelerId) {
      res.status(403).json({ message: 'Only the tour host can reject requests' });
      return;
    }

    connect.status = 'rejected';
    await connect.save();

    const postTitle = (connect.post as unknown as { title?: string })?.title || 'your tour';
    await Notification.create({
      user: connect.traveler,
      fromUser: travelerId,
      type: 'rejected',
      post: connect.post,
      connect: connect._id,
      text: `Your request to join "${postTitle}" has been rejected.`,
      link: `/post/${connect.post}`
    });

    res.json({ message: 'Join request rejected', connect });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
