import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  address: string;
  city: string;
  email: string;
  telephone: string;
  phone: string;
  phone_2?: string;
}

const contactSchema = new Schema<IContact>({
  address: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: String, required: true },
  phone: { type: String, required: true },
  phone_2: { type: String }
}, { timestamps: true });

export default mongoose.model<IContact>('Contact', contactSchema);
