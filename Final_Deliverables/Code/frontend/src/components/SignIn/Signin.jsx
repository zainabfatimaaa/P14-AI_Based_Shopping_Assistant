import React, { useState } from 'react';
import './Signin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const TOKEN_KEY = 'token';
const USER_ID_KEY = 'userId';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      const response = await fetch('https://sproj-p14-code.onrender.com/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const { token, userId } = await response.json();
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_ID_KEY, userId);
        setSuccessMessage('Login successful. Redirecting...');
        setTimeout(() => window.location.href = '/', 1000);
      } else {
        setErrorMessage('Invalid email or password.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      setErrorMessage('An error occurred while submitting the form.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleTogglePage = (page) => {
    setIsSignIn(page === 'signin');
    if (page === 'signup') {
      navigate('/signup');
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <div className="signin-left">
          <img src="./cover.jpg" alt="Kurta" className="signin-image" />
        </div>
        <div className="signin-right">
          {/* Clickable Logo */}
          <h2 className="shop-savvy-title">
            <a href="/">S H O P  S A V V Y</a>
          </h2>
          <h2 className="trend-message">Discover the</h2>
          <h2 className="trend-message-second">latest trends now</h2>

          {successMessage && <p className="success">{successMessage}</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}

          <form onSubmit={handleSubmit} className="signin-form">
            <div className="input-container">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-container">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit">Sign In</button>
          </form>

          <div className="auth-footer-container">
            <div className="auth-footer-line"></div>
            <div className="auth-footer">
              <div
                className={`auth-option ${!isSignIn ? 'active' : ''}`}
                onClick={() => handleTogglePage('signup')}
              >
                Sign up
              </div>
              <div
                className={`auth-option ${isSignIn ? 'active' : ''}`}
                onClick={() => handleTogglePage('signin')}
              >
                Sign in
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
