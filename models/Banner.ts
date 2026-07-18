import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  title?: string;
  image: string;
}

const bannerSchema = new Schema<IBanner>({
  title: { type: String },
  image: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IBanner>('Banner', bannerSchema);
