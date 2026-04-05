import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  image: { type: String, default: '' },
  category: { type: String, default: 'Grocery' },
  description: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
  expiryDate: { type: String, default: '' }
}, { timestamps: true });
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
