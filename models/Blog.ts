import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  status: string;
  details: string;
  blog_image?: string;
  traveler: Types.ObjectId;
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  status: { type: String, default: 'pending' },
  details: { type: String, required: true },
  blog_image: { type: String },
  traveler: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IBlog>('Blog', blogSchema);
