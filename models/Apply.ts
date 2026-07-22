import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IApply extends Document {
  name: string;
  email: string;
  phone: string;
  address?: string;
  bio?: string;
  experience?: string;
  profile_image?: string;
  cv: string;
  status: string;
  user?: Types.ObjectId;
}

const applySchema = new Schema<IApply>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  bio: { type: String },
  experience: { type: String },
  profile_image: { type: String },
  cv: { type: String, required: true },
  status: { type: String, default: 'pending' },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model<IApply>('Apply', applySchema);
