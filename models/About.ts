import mongoose, { Schema, Document } from 'mongoose';

export interface IAbout extends Document {
  title: string;
  des: string;
  about_image?: string;
}

const aboutSchema = new Schema<IAbout>({
  title: { type: String, required: true },
  des: { type: String, required: true },
  about_image: { type: String }
}, { timestamps: true });

export default mongoose.model<IAbout>('About', aboutSchema);
