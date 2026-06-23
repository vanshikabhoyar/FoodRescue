import React, { useState } from 'react';

const RecipeCard = ({ recipe }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '16px', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.07)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>{recipe.title}</h3>
        <span style={{ background: recipe.urgency === 'high' ? '#ff6b6b' : '#f0a500', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
          {recipe.urgency === 'high' ? '🔥 Use Today' : '⚡ Use Soon'}
        </span>
      </div>
      <p style={{ color: '#666', margin: '8px 0' }}>{recipe.description}</p>
      <p style={{ color: '#888', fontSize: '0.85rem' }}>⏱ {recipe.cookTime}</p>
      <button onClick={() => setOpen(!open)} style={{ background: '#2d6a4f', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', marginTop: '8px' }}>
        {open ? 'Hide Steps' : 'View Recipe'}
      </button>
      {open && (
        <div style={{ marginTop: '12px' }}>
          <strong>Ingredients:</strong>
          <ul>{recipe.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
          <strong>Steps:</strong>
          <ol>{recipe.steps.map((s, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{s}</li>)}</ol>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;