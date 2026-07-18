import mongoose, { Schema, Document } from 'mongoose';

export interface IApply extends Document {
  name: string;
  email: string;
  phone: string;
  cv: string;
  status: string;
}

const applySchema = new Schema<IApply>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  cv: { type: String, required: true },
  status: { type: String, default: 'active' }
}, { timestamps: true });

export default mongoose.model<IApply>('Apply', applySchema);
