import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: string;
  status: string;
  role: 'traveler' | 'admin' | 'guide';
  profilePicture?: string;
  address?: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  gender: { type: String },
  status: { type: String, default: 'active' },
  role: { type: String, enum: ['traveler', 'admin', 'guide'], default: 'traveler' },
  profilePicture: { type: String },
  address: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
