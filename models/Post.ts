import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  date_from?: Date;
  date_to?: Date;
  amount: number;
  status: string;
  details: string;
  contact?: string;
  gender?: string;
  place_from?: string;
  place_to?: string;
  image?: string;
  members?: number;
  join_deadline?: number;
  traveler: Types.ObjectId;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  date_from: { type: Date },
  date_to: { type: Date },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  details: { type: String, required: true },
  contact: { type: String },
  gender: { type: String },
  place_from: { type: String },
  place_to: { type: String },
  image: { type: String },
  members: { type: Number },
  join_deadline: { type: Number },
  traveler: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IPost>('Post', postSchema);
