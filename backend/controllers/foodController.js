const FoodItem = require('../models/FoodItem');

exports.addFoodItem = async (req, res) => {
  try {
    const { name, expiryDate, quantity, category } = req.body;
    const item = await FoodItem.create({
      user: req.user.id,
      name,
      expiryDate: new Date(expiryDate),
      quantity,
      category
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFoodItems = async (req, res) => {
  try {
    const items = await FoodItem.find({ user: req.user.id }).sort({ expiryDate: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExpiringItems = async (req, res) => {
  try {
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const items = await FoodItem.find({
      user: req.user.id,
      expiryDate: { $lte: threeDaysLater },
      isExpired: false,
      isDonated: false
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};