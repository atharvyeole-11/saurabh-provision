import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mrp: { type: Number, required: true },
  price: { type: Number, required: true }, // This will be the discounted price
  discount: { type: Number, default: 0 }, // Percentage discount
  image: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Grocery', 'Dairy', 'Snacks', 'Beverages', 'Fasting Items', 'Stationery', 'Household Items', 'Personal Care', 'Daily Essentials'],
    default: 'Grocery' 
  },
  description: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 },
  availabilityStatus: { 
    type: String, 
    enum: ['In Stock', 'Out of Stock', 'Coming Soon'],
    default: 'In Stock'
  },
  expiryDate: { type: String, default: '' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
