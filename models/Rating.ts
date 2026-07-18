import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRating extends Document {
  member: Types.ObjectId;
  post: Types.ObjectId;
  rating: number;
  taken_by?: Types.ObjectId;
  given_by?: Types.ObjectId;
  comment?: string;
}

const ratingSchema = new Schema<IRating>({
  member: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  rating: { type: Number, required: true },
  taken_by: { type: Schema.Types.ObjectId, ref: 'User' },
  given_by: { type: Schema.Types.ObjectId, ref: 'User' },
  comment: { type: String }
}, { timestamps: true });

export default mongoose.model<IRating>('Rating', ratingSchema);
