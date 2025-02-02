import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const TOKEN_KEY = 'token';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem(TOKEN_KEY);

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleSignOut = () => {
    localStorage.removeItem(TOKEN_KEY); // Remove token from localStorage
    navigate('/signin'); // Redirect to the sign-in page
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>ShopSavvy</h1>
      </div>
      <div className="header-buttons">
        {token ? (
          <>
            <button onClick={handleHome}>Home</button>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <>
            <button onClick={handleHome}>Home</button>
            <button onClick={handleSignIn}>Sign In</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
