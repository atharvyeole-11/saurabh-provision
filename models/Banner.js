import mongoose from 'mongoose';
const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  image: { type: String, default: '' },
  bgColor: { type: String, default: '#16a34a' },
  festival: { type: String, default: 'Custom' },
  products: [{ name: String, price: String }],
  buttonText: { type: String, default: 'Order Now' },
  buttonLink: { type: String, default: '/products' },
  isActive: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
