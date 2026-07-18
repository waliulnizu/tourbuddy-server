import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Guide from './models/Guide';

async function run(): Promise<void> {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourbuddy';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const guide = new Guide({
      name: 'Test Guide',
      designation: 'Guide',
      phone: '123456',
      guide_image: 'uploads/test.jpg',
      status: 'active'
    });

    await guide.save();
    console.log('Guide saved successfully!');

    await Guide.deleteOne({ _id: guide._id });
    console.log('Test guide deleted.');
  } catch (err) {
    console.error('Save error:', err);
  } finally {
    mongoose.disconnect();
  }
}

run();
