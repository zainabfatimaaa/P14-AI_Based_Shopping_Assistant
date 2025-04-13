import React, { useState, useEffect } from 'react';
import SignIn from '../SignIn/Signin.jsx';

function SignInC() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track auth status

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // setIsAuthenticated(false);
      window.location.href = '/';
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return null; 
  }

  return <SignIn />;
}

export default SignInC;
