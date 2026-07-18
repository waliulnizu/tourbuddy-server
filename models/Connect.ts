import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConnect extends Document {
  post: Types.ObjectId;
  traveler: Types.ObjectId;
  status: string;
}

const connectSchema = new Schema<IConnect>({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  traveler: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'active' }
}, { timestamps: true });

export default mongoose.model<IConnect>('Connect', connectSchema);
