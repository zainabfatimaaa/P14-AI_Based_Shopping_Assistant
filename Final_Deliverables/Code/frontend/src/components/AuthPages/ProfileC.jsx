import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from '../Profile/Profile.jsx';

function ProfileC() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Token not found. User unauthorized access attempted.');
      navigate('/'); // ✅ smoother navigation
    } else {
      setIsAuthenticated(true); // ✅ authenticated user
    }
  }, [navigate]);

  if (isAuthenticated === null) {
    return null; // or a loading spinner if you prefer
  }

  return <Profile />;
}

export default ProfileC;
