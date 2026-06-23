const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { scanBill } = require('../controllers/scanController');

router.post('/', auth, scanBill);

module.exports = router;