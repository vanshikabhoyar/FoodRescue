import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import FoodCard from '../components/FoodCard';

const FoodItems = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', expiryDate: '', quantity: '1', category: 'other' });
  const [showForm, setShowForm] = useState(false);
  const [donateModal, setDonateModal] = useState(null);
  const [donateForm, setDonateForm] = useState({ location: '', contactNumber: '', description: '' });

  useEffect(() => {
    API.get('/food').then(r => setItems(r.data));
  }, []);

  const handleAdd = async () => {
    const { data } = await API.post('/food', form);
    setItems([...items, data]);
    setForm({ name: '', expiryDate: '', quantity: '1', category: 'other' });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    await API.delete(`/food/${id}`);
    setItems(items.filter(i => i._id !== id));
  };

  const handleDonate = (item) => {
    setDonateModal(item);
  };

  const submitDonation = async () => {
    await API.post('/donations', { foodItemId: donateModal._id, ...donateForm });
    setItems(items.map(i => i._id === donateModal._id ? { ...i, isDonated: true } : i));
    setDonateModal(null);
    setDonateForm({ location: '', contactNumber: '', description: '' });
    alert('Donation listed!');
  };

  const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#2d6a4f', margin: 0 }}>🥫 My Food Items</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#2d6a4f', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer' }}>
          + Add Item
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f0f7f4', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
          <input placeholder="Food Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
          <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} style={inputStyle} />
          <input placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} style={inputStyle} />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
            {['dairy','bakery','vegetables','fruits','meat','grains','beverages','other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button onClick={handleAdd} style={{ background: '#2d6a4f', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
            Save Item
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {items.filter(i => !i.isDonated).map(item => (
          <FoodCard key={item._id} item={item} onDelete={handleDelete} onDonate={handleDonate} />
        ))}
      </div>

      {donateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', width: '400px' }}>
            <h3>Donate: {donateModal.name}</h3>
            <input placeholder="Your Location" value={donateForm.location} onChange={e => setDonateForm({ ...donateForm, location: e.target.value })} style={inputStyle} />
            <input placeholder="Contact Number" value={donateForm.contactNumber} onChange={e => setDonateForm({ ...donateForm, contactNumber: e.target.value })} style={inputStyle} />
            <input placeholder="Description (optional)" value={donateForm.description} onChange={e => setDonateForm({ ...donateForm, description: e.target.value })} style={inputStyle} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={submitDonation} style={{ flex: 1, padding: '10px', background: '#52b788', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>List for Donation</button>
              <button onClick={() => setDonateModal(null)} style={{ flex: 1, padding: '10px', background: '#aaa', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItems;