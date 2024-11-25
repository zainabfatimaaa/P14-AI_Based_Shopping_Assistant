import React, { useState } from 'react';
import './Signin.css'
const TOKEN_KEY = 'token';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      const response = await fetch('http://localhost:8000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log(response);

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem(TOKEN_KEY, token);
        window.location.href = '/';
      } else {
        setErrorMessage('Invalid email or password.');
      }
    } catch (error) {
      console.error('An error occurred while submitting the form', error);
      setErrorMessage('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <a href="/" className="website-name">Shop Savvy</a>
        <h2></h2>
      </div>
      <div className="signin-right">
        <div className="signup-link-container">
          <p className="signup-link">
            Don’t have an account? <a href="/signup">Join now</a>
          </p>
        </div>
        <h2>Sign in to Our Platform</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
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
      </div>
    </div>
  );
}

export default SignIn;
