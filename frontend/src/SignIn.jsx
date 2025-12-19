import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (formData.email && formData.password) {
        const mockUser = { username: formData.email.split('@')[0], email: formData.email };
        const mockToken = 'mock-jwt-token-' + Date.now();
        login(mockUser, mockToken);
        navigate('/');
      } else {
        setError('All fields are required');
      }
      setLoading(false);
    }, 1000);
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
    maxWidth: '400px',
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
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: 'clamp(20px, 5vw, 28px)' }}>Sign In</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(12px, 2vw, 14px)' }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: 'clamp(12px, 2vw, 14px)' }}>
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;