import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourbuddy';

async function seed(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const existing = await User.findOne({ email: 'admin@tourbuddy.com' });
    if (existing) {
      console.log('Admin user already exists.');
      await mongoose.disconnect();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admintourbuddy@1234', salt);

    const admin = new User({
      name: 'Admin',
      email: 'admin@tourbuddy.com',
      password: hashedPassword,
      phone: '1234567890',
      role: 'admin',
      status: 'active'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@tourbuddy.com');
    console.log('Password: Admintourbuddy@1234');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
