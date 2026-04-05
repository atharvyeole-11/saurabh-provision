import mongoose from 'mongoose';
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: '🛒' },
  slug: { type: String, unique: true }
}, { timestamps: true });
export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
