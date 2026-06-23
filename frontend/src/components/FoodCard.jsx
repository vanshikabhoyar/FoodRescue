import React from 'react';

const FoodCard = ({ item, onDelete, onDonate }) => {
  const expiry = new Date(item.expiryDate);
  const today = new Date();
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  const getBadgeColor = () => {
    if (daysLeft <= 0) return '#ff4444';
    if (daysLeft <= 2) return '#ff8c00';
    if (daysLeft <= 5) return '#f0a500';
    return '#2d6a4f';
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '16px', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.07)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{item.name}</h3>
        <span style={{ background: getBadgeColor(), color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
          {daysLeft <= 0 ? 'Expired' : `${daysLeft}d left`}
        </span>
      </div>
      <p style={{ color: '#666', margin: '8px 0' }}>
        📦 {item.quantity} &nbsp;|&nbsp; 🏷️ {item.category}
      </p>
      <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0' }}>
        Expires: {expiry.toDateString()}
      </p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        <button onClick={() => onDonate(item)} style={{ background: '#52b788', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
          Donate
        </button>
        <button onClick={() => onDelete(item._id)} style={{ background: '#ff6b6b', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default FoodCard;