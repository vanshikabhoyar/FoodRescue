const Anthropic = require('@anthropic-ai/sdk');
const FoodItem = require('../models/FoodItem');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

exports.getRecipes = async (req, res) => {
  try {
    // Get items expiring in next 3 days
    const soon = new Date();
    soon.setDate(soon.getDate() + 3);

    const items = await FoodItem.find({
      user: req.user.id,
      expiryDate: { $lte: soon },
      isExpired: false,
      isDonated: false
    });

    if (items.length === 0) {
      return res.json({ recipes: [], message: 'No expiring items found' });
    }

    const ingredientList = items.map(i => `${i.name} (expires: ${i.expiryDate.toDateString()})`).join(', ');

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `I have these food items expiring soon: ${ingredientList}

Suggest 3 recipes I can make to use them before they expire.
Return ONLY a JSON array:
[
  {
    "title": "Recipe Name",
    "description": "Short description",
    "ingredients": ["item1", "item2"],
    "steps": ["Step 1", "Step 2", "Step 3"],
    "cookTime": "20 mins",
    "urgency": "high"
  }
]
urgency: "high" if using items expiring today/tomorrow, "medium" for 2-3 days.
Return ONLY the JSON array.`
        }
      ]
    });

    const text = response.content[0].text.trim();
    const recipes = JSON.parse(text);
    res.json({ recipes, expiringItems: items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};