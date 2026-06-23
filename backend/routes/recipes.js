const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getRecipes } = require('../controllers/recipeController');

router.get('/', auth, getRecipes);

module.exports = router;