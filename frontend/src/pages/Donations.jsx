import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import DonationCard from '../components/DonationCard';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    API.get('/donations').then(r => setDonations(r.data));
  }, []);

  const handleClaim = (id) => {
    setDonations(donations.map(d => d._id === id ? { ...d, status: 'claimed' } : d));
  };

  const tabStyle = (active) => ({
    padding: '8px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer',
    background: active ? '#2d6a4f' : '#eee', color: active ? 'white' : '#333'
  });

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ color: '#2d6a4f' }}>🤝 Food Donations</h2>
      <p style={{ color: '#666' }}>Claim available food donations listed by others in your community.</p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button onClick={() => setTab('all')} style={tabStyle(tab === 'all')}>All Available</button>
        <button onClick={() => setTab('claimed')} style={tabStyle(tab === 'claimed')}>Claimed</button>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {donations
          .filter(d => tab === 'all' ? d.status === 'available' : d.status === 'claimed')
          .map(d => <DonationCard key={d._id} donation={d} onClaim={handleClaim} />)
        }
        {donations.filter(d => tab === 'all' ? d.status === 'available' : d.status === 'claimed').length === 0 && (
          <p style={{ color: '#888' }}>No donations in this category yet.</p>
        )}
      </div>
    </div>
  );
};

export default Donations;