import { Response } from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message';
import { AuthRequest } from '../types';

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const senderId = req.user?.userId;
    const { receiverId, postId, text } = req.body;

    if (!receiverId || !postId || !text?.trim()) {
      res.status(400).json({ message: 'Receiver, post, and message text are required' });
      return;
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      post: postId,
      text: text.trim()
    });

    await message.save();

    const populated = await Message.findById(message._id)
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture');

    res.status(201).json({ message: 'Message sent successfully', data: populated });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const getInbox = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user?.userId);

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture')
      .populate('post', 'title')
      .sort({ createdAt: -1 });

    const convMap = new Map<string, {
      otherUser: { _id: string; name?: string; profilePicture?: string };
      lastMessage: { text: string; createdAt: string };
      unreadCount: number;
      postId: string | null;
      postTitle: string | null;
    }>();

    for (const msg of messages) {
      const senderId = String(msg.sender._id);
      const receiverId = String(msg.receiver._id);
      const otherUserId = senderId === String(userId) ? receiverId : senderId;
      const otherUser = senderId === String(userId)
        ? { _id: receiverId, name: (msg.receiver as unknown as { name?: string })?.name, profilePicture: (msg.receiver as unknown as { profilePicture?: string })?.profilePicture }
        : { _id: senderId, name: (msg.sender as unknown as { name?: string })?.name, profilePicture: (msg.sender as unknown as { profilePicture?: string })?.profilePicture };

      if (!convMap.has(otherUserId)) {
        const postData = msg.post as unknown as { _id?: string; title?: string } | null;
        convMap.set(otherUserId, {
          otherUser,
          lastMessage: { text: msg.text, createdAt: String(msg.createdAt) },
          unreadCount: receiverId === String(userId) && !msg.read ? 1 : 0,
          postId: postData?._id || null,
          postTitle: postData?.title || null,
        });
      } else {
        const existing = convMap.get(otherUserId)!;
        if (receiverId === String(userId) && !msg.read) {
          existing.unreadCount += 1;
        }
      }
    }

    const conversations = Array.from(convMap.entries()).map(([id, data]) => ({
      _id: id,
      user: data.otherUser,
      post: data.postId ? { _id: data.postId, title: data.postTitle } : null,
      lastMessage: data.lastMessage,
      unreadCount: data.unreadCount,
    }));

    res.json({ conversations });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const getConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { otherUserId, postId } = req.params;

    const messages = await Message.find({
      post: postId,
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture')
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { senderId, postId } = req.params;

    await Message.updateMany(
      { sender: senderId, receiver: userId, post: postId, read: false },
      { $set: { read: true } }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const result = await Message.aggregate([
      { $match: { receiver: userId, read: false } },
      { $count: 'count' }
    ]);

    const count = result.length > 0 ? result[0].count : 0;
    res.json({ count });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
