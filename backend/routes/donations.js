const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createDonation, getAllDonations, claimDonation, getMyDonations } = require('../controllers/donationController');

router.post('/', auth, createDonation);
router.get('/', auth, getAllDonations);
router.get('/mine', auth, getMyDonations);
router.patch('/:id/claim', auth, claimDonation);

module.exports = router;