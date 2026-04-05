import { Schema } from 'mongoose';

const bannerSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ['hero', 'promotion', 'announcement'],
    default: 'hero',
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

bannerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default bannerSchema;
