import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes';
import frontendRoutes from './routes/frontendRoutes';
import adminRoutes from './routes/adminRoutes';
import travelerRoutes from './routes/travelerRoutes';
import { auth } from './middleware/auth';
import upload from './middleware/upload';
import { submitApplication, getAllApplications } from './controllers/applyController';
import { createRating, getRatingsForMember } from './controllers/ratingController';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourbuddy';

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Successfully connected to MongoDB.');
}).catch((err: Error) => {
  console.error('MongoDB connection error:', err);
  process.exit();
});

app.use('/api/auth', authRoutes);
app.use('/api/public', frontendRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/traveler', travelerRoutes);

app.post('/api/apply', upload.single('cv'), submitApplication);
app.get('/api/applications', auth, getAllApplications);
app.post('/api/ratings', auth, createRating);
app.get('/api/ratings/:id', getRatingsForMember);

app.post('/api/contact-submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log('Contact submission:', { name, email, message });
    res.json({ message: 'Message sent successfully!' });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TourBuddy API' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

server.timeout = 120000;
