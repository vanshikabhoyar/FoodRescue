const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addFoodItem, getFoodItems, updateFoodItem, deleteFoodItem, getExpiringItems } = require('../controllers/foodController');

router.post('/', auth, addFoodItem);
router.get('/', auth, getFoodItems);
router.get('/expiring', auth, getExpiringItems);
router.put('/:id', auth, updateFoodItem);
router.delete('/:id', auth, deleteFoodItem);

module.exports = router;