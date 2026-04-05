import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    qty: Number,
    price: Number,
    discount: Number
  }],
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMode: { type: String, enum: ['cash', 'online'], default: 'cash' },
  paymentId: { type: String, default: '' },
  pickupTime: { type: String, required: true },
  status: { type: String, enum: ['pending', 'ready', 'completed'], default: 'pending' },
  orderId: { type: String, unique: true }
}, { timestamps: true });
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
