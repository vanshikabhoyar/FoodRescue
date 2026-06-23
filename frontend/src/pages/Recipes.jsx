import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import RecipeCard from '../components/RecipeCard';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/recipes').then(r => {
      setRecipes(r.data.recipes);
      setExpiringItems(r.data.expiringItems || []);
      setMessage(r.data.message || '');
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ color: '#2d6a4f' }}>🍳 Cook Before It Expires!</h2>

      {expiringItems.length > 0 && (
        <div style={{ background: '#fff3cd', padding: '12px 20px', borderRadius: '10px', marginBottom: '24px' }}>
          <strong>Using these expiring ingredients: </strong>
          {expiringItems.map(i => i.name).join(', ')}
        </div>
      )}

      {loading ? (
        <p>Getting recipe suggestions from AI... 🤖</p>
      ) : recipes.length === 0 ? (
        <p style={{ color: '#666' }}>{message || 'No expiring items found. Add food items to get recipe suggestions!'}</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {recipes.map((recipe, idx) => <RecipeCard key={idx} recipe={recipe} />)}
        </div>
      )}
    </div>
  );
};

export default Recipes;