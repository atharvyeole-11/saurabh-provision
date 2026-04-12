import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String }
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  pickupTime: { type: String, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'online', 'upi'], 
    required: true,
    default: 'cash'
  },
  paymentId: { type: String, default: null },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  status: { 
    type: String, 
    enum: ['pending', 'ready', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  notes: { type: String, default: '' },
  storeLocation: {
    name: { type: String, default: 'Saurabh Provision' },
    address: { type: String, default: 'Malegaon, Maharashtra' },
    phone: { type: String, default: '9766689821' }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better performance
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ customerId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

// Virtual for formatted order date
OrderSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-IN');
});

// Virtual for formatted order time
OrderSchema.virtual('formattedTime').get(function() {
  return this.createdAt.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
