import React from 'react';
import API from '../api/axios';

const DonationCard = ({ donation, onClaim }) => {
  const handleClaim = async () => {
    try {
      await API.patch(`/donations/${donation._id}/claim`);
      onClaim(donation._id);
    } catch (err) {
      alert('Failed to claim donation');
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '16px', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.07)' }}>
      <h3 style={{ margin: 0 }}>{donation.foodItem?.name}</h3>
      <p style={{ color: '#666', margin: '8px 0' }}>{donation.description}</p>
      <p style={{ color: '#888', fontSize: '0.85rem' }}>
        📍 {donation.location} &nbsp;|&nbsp; 📞 {donation.contactNumber}
      </p>
      <p style={{ color: '#888', fontSize: '0.85rem' }}>
        By: {donation.donor?.name} ({donation.donor?.email})
      </p>
      <span style={{ background: donation.status === 'available' ? '#52b788' : '#aaa', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
        {donation.status}
      </span>
      {donation.status === 'available' && (
        <button onClick={handleClaim} style={{ marginLeft: '10px', background: '#2d6a4f', color: 'white', border: 'none', padding: '5px 14px', borderRadius: '6px', cursor: 'pointer' }}>
          Claim
        </button>
      )}
    </div>
  );
};

export default DonationCard;