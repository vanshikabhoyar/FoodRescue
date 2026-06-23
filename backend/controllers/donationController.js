const Donation = require('../models/Donation');
const FoodItem = require('../models/FoodItem');

exports.createDonation = async (req, res) => {
  try {
    const { foodItemId, description, location, contactNumber } = req.body;

    const foodItem = await FoodItem.findOne({ _id: foodItemId, user: req.user.id });
    if (!foodItem) return res.status(404).json({ message: 'Food item not found' });

    const donation = await Donation.create({
      donor: req.user.id,
      foodItem: foodItemId,
      description,
      location,
      contactNumber
    });

    // Mark food item as donated
    foodItem.isDonated = true;
    await foodItem.save();

    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'available' })
      .populate('donor', 'name email')
      .populate('foodItem', 'name expiryDate category');
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: 'claimed' },
      { new: true }
    );
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('foodItem', 'name expiryDate');
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};