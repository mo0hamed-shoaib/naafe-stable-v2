

const MinimalTest = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F5E6D3', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#2D5D4F',
          marginBottom: '1rem'
        }}>
          Basic React Test
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#50958a',
          marginBottom: '2rem'
        }}>
          If you can see this, React is working!
        </p>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#0e1b18',
            marginBottom: '1rem'
          }}>
            Status Check:
          </h2>
          <ul style={{ 
            textAlign: 'left', 
            listStyle: 'none', 
            padding: 0,
            color: '#50958a'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>✅ React is working</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ TypeScript is working</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ Basic styling is working</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ No external dependencies</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MinimalTest; 