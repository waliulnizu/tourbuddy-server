import mongoose, { Schema, Document } from 'mongoose';

export interface IBannerText extends Document {
  title: string;
  details: string;
}

const bannerTextSchema = new Schema<IBannerText>({
  title: { type: String, required: true },
  details: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IBannerText>('BannerText', bannerTextSchema);
