import { Response } from 'express';
import Rating from '../models/Rating';
import { AuthRequest } from '../types';

export const createRating = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { member, post, rating, comment } = req.body;
    const newRating = new Rating({
      member,
      post,
      rating,
      comment,
      given_by: req.user?.userId
    });
    await newRating.save();
    res.status(201).json({ message: 'Rating created successfully', rating: newRating });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};

export const getRatingsForMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ratings = await Rating.find({ member: req.params.id }).populate('given_by', 'name');
    res.json({ ratings });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
};
