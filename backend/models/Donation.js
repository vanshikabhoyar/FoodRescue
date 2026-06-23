const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  description: { type: String },
  location: { type: String, required: true },
  contactNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ['available', 'claimed', 'completed'],
    default: 'available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);