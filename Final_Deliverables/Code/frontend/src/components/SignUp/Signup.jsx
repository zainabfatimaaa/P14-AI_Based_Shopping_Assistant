import React, { useState } from 'react';
import './Signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(
      validatePassword(newPassword)
        ? ''
        : 'Password must be at least 6 characters, include one special character, one uppercase, and one lowercase letter.'
    );
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordError(
      newConfirmPassword === password ? '' : 'Passwords do not match.'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password) || password !== confirmPassword) {
      setErrorMessage('Please fix the errors before submitting.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      const response = await fetch('https://sproj-p14-code.onrender.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Account created successfully. Redirecting...');
        setTimeout(() => navigate('/signin'), 1000);
      } else {
        setErrorMessage(data.message || 'Signup failed. Please try again.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleTogglePage = (page) => {
    setIsSignUp(page === 'signup');
    if (page === 'signin') {
      navigate('/signin');
    }
  };

  return (
    <div>
      <div className="signup-container">
        <div className="signup-box">
          <div className="signup-left">
            <img src="./cover.jpg" alt="Kurta" className="signup-image" />
          </div>
          <div className="signup-right">
            <h2 className="shop-savvy-title">
              <a href="/">S H O P  S A V V Y</a>
            </h2>
            {successMessage && <p className="success">{successMessage}</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="input-container">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

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
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              {passwordError && <p className="error">{passwordError}</p>}

              <div className="input-container">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
              </div>
              {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}

              <button type="submit">Create Account</button>
            </form>

            <div className="auth-footer-container">
              <div className="auth-footer-line"></div>
              <div className="auth-footer">
                <div
                  className={`auth-option ${isSignUp ? 'active' : ''}`}
                  onClick={() => handleTogglePage('signup')}
                >
                  Sign up
                </div>
                <div
                  className={`auth-option ${!isSignUp ? 'active' : ''}`}
                  onClick={() => handleTogglePage('signin')}
                >
                  Sign in
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
