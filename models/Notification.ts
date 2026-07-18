import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
  user: Types.ObjectId;
  fromUser: Types.ObjectId;
  type: 'join_request' | 'message' | 'approved' | 'rejected';
  post: Types.ObjectId;
  connect?: Types.ObjectId;
  text: string;
  read: boolean;
  link: string;
}

const notificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['join_request', 'message', 'approved', 'rejected'], required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  connect: { type: Schema.Types.ObjectId, ref: 'Connect' },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: { type: String, required: true }
}, { timestamps: true });

notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
