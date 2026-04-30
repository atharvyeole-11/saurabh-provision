import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  address: { type: String },
  role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user' }
}, { timestamps: true });
export default mongoose.models.User || mongoose.model('User', UserSchema);
