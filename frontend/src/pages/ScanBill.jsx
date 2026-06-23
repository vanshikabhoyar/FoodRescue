import React, { useState } from 'react';
import API from '../api/axios';

const ScanBill = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1];
        const mediaType = image.type;
        const { data } = await API.post('/scan', { imageBase64: base64, mediaType });
        setResult(data);
        setLoading(false);
      };
      reader.readAsDataURL(image);
    } catch (err) {
      setError(err.response?.data?.message || 'Scan failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ color: '#2d6a4f' }}>📷 Scan Bill or Product</h2>
      <p style={{ color: '#666' }}>Upload a photo of your grocery bill or product label — we'll auto-detect food items and expiry dates.</p>

      <div style={{ border: '2px dashed #2d6a4f', borderRadius: '12px', padding: '40px', textAlign: 'center', marginBottom: '20px' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} id="upload" style={{ display: 'none' }} />
        <label htmlFor="upload" style={{ cursor: 'pointer', color: '#2d6a4f', fontWeight: 'bold' }}>
          {preview ? '📁 Change Image' : '📁 Choose Image'}
        </label>
        {preview && <img src={preview} alt="Preview" style={{ display: 'block', maxWidth: '100%', marginTop: '20px', borderRadius: '8px' }} />}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleScan} disabled={!image || loading}
        style={{ width: '100%', padding: '12px', background: loading ? '#aaa' : '#2d6a4f', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem' }}>
        {loading ? 'Scanning...' : '🔍 Scan & Save Items'}
      </button>

      {result && (
        <div style={{ marginTop: '24px', background: '#f0f7f4', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ color: '#2d6a4f' }}>✅ {result.saved.length} Items Saved!</h3>
          {result.extracted.map((item, idx) => (
            <div key={idx} style={{ padding: '10px', background: 'white', borderRadius: '8px', marginBottom: '8px', border: '1px solid #d8f3dc' }}>
              <strong>{item.name}</strong> — {item.quantity} — Expires: {item.expiryDate}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScanBill;