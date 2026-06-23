const cron = require('node-cron');
const nodemailer = require('nodemailer');
const FoodItem = require('../models/FoodItem');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendExpiryAlert = async (userEmail, userName, items) => {
  const itemList = items.map(i =>
    `• ${i.name} — expires on ${i.expiryDate.toDateString()}`
  ).join('\n');

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: '🍎 FoodRescue: Items Expiring Soon!',
    text: `Hi ${userName},\n\nThe following items are expiring within 2 days:\n\n${itemList}\n\nLog in to FoodRescue to get recipe suggestions or list them for donation!\n\n— FoodRescue Team`
  });
};

const startCronJobs = () => {
  // Run every day at 8 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('Running expiry check cron job...');
    try {
      const twoDaysLater = new Date();
      twoDaysLater.setDate(twoDaysLater.getDate() + 2);

      const expiringItems = await FoodItem.find({
        expiryDate: { $lte: twoDaysLater },
        isExpired: false,
        isDonated: false,
        alertSent: false
      }).populate('user', 'name email');

      // Group by user
      const byUser = {};
      expiringItems.forEach(item => {
        const uid = item.user._id.toString();
        if (!byUser[uid]) byUser[uid] = { user: item.user, items: [] };
        byUser[uid].items.push(item);
      });

      for (const uid in byUser) {
        const { user, items } = byUser[uid];
        await sendExpiryAlert(user.email, user.name, items);

        // Mark alerts as sent
        await FoodItem.updateMany(
          { _id: { $in: items.map(i => i._id) } },
          { alertSent: true }
        );
      }

      // Mark actually expired items
      await FoodItem.updateMany(
        { expiryDate: { $lt: new Date() }, isExpired: false },
        { isExpired: true }
      );

      console.log(`Expiry alerts sent for ${Object.keys(byUser).length} users`);
    } catch (err) {
      console.error('Cron job error:', err.message);
    }
  });
};

module.exports = { startCronJobs };