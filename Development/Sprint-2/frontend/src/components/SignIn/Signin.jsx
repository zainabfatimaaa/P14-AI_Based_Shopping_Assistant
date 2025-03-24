// import React, { useState } from 'react';
// import './Signin.css';
// import Header from '../Header/Header';



// const TOKEN_KEY = 'token';

// function SignIn() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const userData = { email, password };

//     try {
//       const response = await fetch('http://localhost:8000/api/signin', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       });

//       if (response.ok) {
//         const { token } = await response.json();
//         localStorage.setItem(TOKEN_KEY, token);
//         window.location.href = '/';
//       } else {
//         setErrorMessage('Invalid email or password.');
//       }
//     } catch (error) {
//       console.error('An error occurred while submitting the form', error);
//       setErrorMessage('An error occurred while submitting the form.');
//     }
//   };

//   return (
//     <div className="signin-page">
//       <div className="signin-form-container">
//         <h2 className="signin-title">LOGIN</h2>
//         {errorMessage && <p className="error">{errorMessage}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email" className="form-label">EMAIL</label>
//             <input
//               type="email"
//               id="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password" className="form-label">PASSWORD</label>
//             <input
//               type="password"
//               id="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <div className="forgot-password">
//               <a href="/forgot-password">Forgot password?</a>
//             </div>
//           </div>
//           <button type="submit" className="signin-btn">SIGN IN</button>
//         </form>
//         <p className="create-account-link">
//           <a href="/signup">Create account</a>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default SignIn;

import React, { useState } from 'react';
import './Signin.css';
import Header from '../Header/Header'; // Importing Header component

const TOKEN_KEY = 'token';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

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
    <div>
      {/* Render Header at the top */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setGenderFilter={setGenderFilter}
      />

      {/* Sign-in page content */}
      <div className="signin-page">
        <div className="signin-form-container">
          <h2 className="signin-title">LOGIN</h2>
          {errorMessage && <p className="error">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">EMAIL</label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">PASSWORD</label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="forgot-password">
                <a href="/forgot-password">Forgot password?</a>
              </div>
            </div>
            <button type="submit" className="signin-btn">SIGN IN</button>
          </form>
          <p className="create-account-link">
            <a href="/signup">Create account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
