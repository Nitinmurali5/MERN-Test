import { useState } from 'react';
import { useAuth } from './AuthContext';

function AddProduct() {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.title.trim() || !formData.price.trim() || !formData.image.trim()) {
      setError('All fields are required');
      return false;
    }
    
    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      setError('Price must be a positive number');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          price: parseFloat(formData.price),
          image: formData.image
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      setMessage('Product added successfully!');
      setFormData({ title: '', price: '', image: '' });
    } catch (err) {
      setError(err.message || 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: 'clamp(20px, 5vw, 50px)',
    minHeight: 'calc(100vh - 80px)',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 'clamp(40px, 10vh, 100px)'
  };

  const formContainerStyle = {
    width: '100%',
    maxWidth: '500px',
    padding: 'clamp(20px, 4vw, 30px)',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '2px solid #ddd',
    borderRadius: '5px',
    fontSize: 'clamp(14px, 2vw, 16px)',
    fontFamily: 'inherit'
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: 'clamp(20px, 5vw, 28px)' }}>
          Add New Product
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(12px, 2vw, 14px)' }}>
              Product Title:
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(12px, 2vw, 14px)' }}>
              Price:
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter price"
              step="0.01"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(12px, 2vw, 14px)' }}>
              Image URL:
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter image URL"
            />
          </div>

          {error && (
            <div style={{ 
              color: 'red', 
              backgroundColor: '#ffe6e6', 
              padding: '12px', 
              borderRadius: '5px',
              textAlign: 'center',
              fontSize: 'clamp(12px, 2vw, 14px)'
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{ 
              color: 'green', 
              backgroundColor: '#e6ffe6', 
              padding: '12px', 
              borderRadius: '5px',
              textAlign: 'center',
              fontSize: 'clamp(12px, 2vw, 14px)'
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: 'clamp(14px, 2vw, 16px)',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;