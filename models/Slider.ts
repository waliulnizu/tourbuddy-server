import mongoose, { Schema, Document } from 'mongoose';

export interface ISlider extends Document {
  slider_title: string;
  slider_slugan: string;
  slider_image: string;
  status: string;
}

const sliderSchema = new Schema<ISlider>({
  slider_title: { type: String, required: true },
  slider_slugan: { type: String, required: true },
  slider_image: { type: String, required: true },
  status: { type: String, default: 'active' }
}, { timestamps: true });

export default mongoose.model<ISlider>('Slider', sliderSchema);
