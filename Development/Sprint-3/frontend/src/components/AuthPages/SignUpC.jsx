import React, { useState, useEffect } from 'react';
import SignUp from '../SignUp/Signup.jsx';

function SignUpC() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

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

  return <SignUp />;
}

export default SignUpC;
