const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  quantity: { type: String, default: '1' },
  category: {
    type: String,
    enum: ['dairy', 'bakery', 'vegetables', 'fruits', 'meat', 'grains', 'beverages', 'other'],
    default: 'other'
  },
  isExpired: { type: Boolean, default: false },
  isDonated: { type: Boolean, default: false },
  alertSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', FoodItemSchema);