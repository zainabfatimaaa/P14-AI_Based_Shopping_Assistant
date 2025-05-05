import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignIn from '../SignIn/Signin.jsx';

function SignInC() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // React router redirect
    } else {
      setIsAuthenticated(false);
    }
  }, [navigate]);

  if (isAuthenticated === null) {
    return null; // Avoid rendering before auth check
  }

  return <SignIn />;
}

export default SignInC;
