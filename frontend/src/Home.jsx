function Home() {
  const containerStyle = {
    textAlign: 'center',
    padding: 'clamp(30px, 5vw, 100px) clamp(20px, 5vw, 40px)',
    minHeight: 'calc(100vh - 80px)',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ 
        color: '#333', 
        marginBottom: '20px',
        fontSize: 'clamp(28px, 8vw, 48px)',
        fontWeight: 'bold',
        lineHeight: '1.2'
      }}>
        Welcome to E-Commerce App
      </h1>
      <p style={{ 
        fontSize: 'clamp(14px, 3vw, 18px)', 
        color: '#666', 
        lineHeight: '1.6',
        maxWidth: '600px'
      }}>
        This is a full-stack e-commerce application built with React and Node.js.
        Sign in to access protected features like adding products.
      </p>
    </div>
  );
}

export default Home;