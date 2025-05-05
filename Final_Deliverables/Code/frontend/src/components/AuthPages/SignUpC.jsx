import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUp from '../SignUp/Signup.jsx';

function SignUpC() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate(); // ✅ React Router navigation

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // ✅ Use navigate instead of full reload
    } else {
      setIsAuthenticated(false); 
    }
  }, [navigate]);

  if (isAuthenticated === null) {
    return null; // or show a loading spinner if you prefer
  }

  return <SignUp />;
}

export default SignUpC;
