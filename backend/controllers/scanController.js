const Anthropic = require('@anthropic-ai/sdk');
const FoodItem = require('../models/FoodItem');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

exports.scanBill = async (req, res) => {
  try {
    const { imageBase64, mediaType } = req.body;
    // mediaType e.g. "image/jpeg" or "image/png"

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType || 'image/jpeg',
                data: imageBase64
              }
            },
            {
              type: 'text',
              text: `Extract all food items and their expiry dates from this bill or product image.
Return ONLY a JSON array like:
[
  { "name": "Milk", "expiryDate": "2024-12-20", "quantity": "1L", "category": "dairy" },
  { "name": "Bread", "expiryDate": "2024-12-18", "quantity": "1 loaf", "category": "bakery" }
]
Categories: dairy, bakery, vegetables, fruits, meat, grains, beverages, other.
If no expiry date found, estimate based on product type (dairy ~7 days, bread ~5 days).
Return ONLY the JSON array, no extra text.`
            }
          ]
        }
      ]
    });

    const text = response.content[0].text.trim();
    const items = JSON.parse(text);

    // Save extracted items to DB
    const saved = await Promise.all(
      items.map(item =>
        FoodItem.create({
          user: req.user.id,
          name: item.name,
          expiryDate: new Date(item.expiryDate),
          quantity: item.quantity || '1',
          category: item.category || 'other'
        })
      )
    );

    res.status(201).json({ extracted: items, saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};