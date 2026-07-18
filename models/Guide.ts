import mongoose, { Schema, Document } from 'mongoose';

export interface IGuide extends Document {
  name: string;
  designation?: string;
  phone: string;
  guide_image: string;
  status: string;
}

const guideSchema = new Schema<IGuide>({
  name: { type: String, required: true },
  designation: { type: String, default: '' },
  phone: { type: String, required: true },
  guide_image: { type: String, required: true },
  status: { type: String, default: 'active' }
}, { timestamps: true });

export default mongoose.model<IGuide>('Guide', guideSchema);
