import { Schema } from 'mongoose';

const bannerSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String },
  bgColor: { type: String, default: '#16a34a' },
  products: [{ 
    name: String, 
    image: String, 
    price: String 
  }],
  isActive: { type: Boolean, default: false },
  festival: { 
    type: String, 
    enum: ['Navratri', 'Diwali', 'Holi', 'Eid', 'Christmas', 'New Year', 'Custom'],
    default: 'Custom'
  },
  buttonText: { type: String, default: 'Order Now' },
  buttonLink: { type: String, default: '/products' },
  displayOrder: { type: Number, default: 0 },
  type: {
    type: String,
    enum: ['hero', 'promotion', 'announcement'],
    default: 'hero'
  },
  startDate: { type: Date },
  endDate: { type: Date }
}, { timestamps: true });

bannerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default bannerSchema;
