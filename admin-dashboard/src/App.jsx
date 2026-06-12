import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsLoggedIn(false);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="app">
      {isLoggedIn ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
