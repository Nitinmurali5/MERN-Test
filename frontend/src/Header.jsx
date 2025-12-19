import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Header() {
  const { user, logout } = useAuth();

  const headerStyle = {
    backgroundColor: '#007bff',
    padding: '15px 20px',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    flexWrap: 'wrap',
    gap: '20px'
  };

  const logoStyle = {
    fontSize: 'clamp(20px, 5vw, 24px)',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white'
  };

  const linksContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(10px, 2vw, 20px)',
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 12px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '5px',
    fontSize: 'clamp(12px, 2vw, 14px)',
    whiteSpace: 'nowrap'
  };

  const logoutButtonStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: 'clamp(12px, 2vw, 14px)',
    fontWeight: 'bold',
    whiteSpace: 'nowrap'
  };

  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <Link 
          to="/" 
          style={logoStyle}
        >
          E-Commerce
        </Link>

        <div style={linksContainerStyle}>
          {user ? (
            <>
              <span style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>
                Welcome, {user.username || user.name}
              </span>
              <Link
                to="/add-product"
                style={linkStyle}
              >
                Add Product
              </Link>
              <button
                onClick={logout}
                style={logoutButtonStyle}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                style={linkStyle}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                style={{
                  ...linkStyle,
                  backgroundColor: '#28a745'
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;