import mongoose, { Schema, Document } from 'mongoose';

export interface IGuide extends Document {
  name: string;
  email?: string;
  designation?: string;
  phone: string;
  address?: string;
  bio?: string;
  experience?: string;
  guide_image: string;
  status: string;
}

const guideSchema = new Schema<IGuide>({
  name: { type: String, required: true },
  email: { type: String },
  designation: { type: String, default: '' },
  phone: { type: String, required: true },
  address: { type: String },
  bio: { type: String },
  experience: { type: String },
  guide_image: { type: String, required: true },
  status: { type: String, default: 'active' }
}, { timestamps: true });

export default mongoose.model<IGuide>('Guide', guideSchema);
