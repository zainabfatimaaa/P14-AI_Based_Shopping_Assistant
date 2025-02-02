// import React, { useState } from 'react';
// import './Signup.css';

// function SignUp() {
//   const [fullName, setFullName] = useState('');
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [confirmPasswordError, setConfirmPasswordError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const validatePassword = (password) => {
//     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
//     return regex.test(password);
//   };

//   const handlePasswordChange = (e) => {
//     const newPassword = e.target.value;
//     setPassword(newPassword);
//     if (validatePassword(newPassword)) {
//       setPasswordError('');
//     } else {
//       setPasswordError('Password must be at least 6 characters, and include one special character, one uppercase letter, and one lowercase letter.');
//     }
//   };

//   const handleConfirmPasswordChange = (e) => {
//     const newConfirmPassword = e.target.value;
//     setConfirmPassword(newConfirmPassword);
//     if (newConfirmPassword === password) {
//       setConfirmPasswordError('');
//     } else {
//       setConfirmPasswordError('Passwords do not match.');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validatePassword(password) && password === confirmPassword) {
//       const userData = {
//         fullName,
//         username,
//         email,
//         password,
//       };

//       try {
//         const response = await fetch('http://localhost:8000/api/signup', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(userData),
//         });

//         if (response.ok) {
//           setSuccessMessage('Account created successfully.');
//           setFullName('');
//           setUsername('');
//           setEmail('');
//           setPassword('');
//           setConfirmPassword('');
//           setTimeout(() => {
//             setSuccessMessage('');
//           }, 4000);
//           setTimeout(() => {
//             window.location.href = '/'; 
//           }, 1000);
//         } else {
//           const data = await response.json();
//           setErrorMessage(data.message || 'Failed to create account.');
//           setTimeout(() => {
//             setErrorMessage('');
//           }, 3000);
//         }
//       } catch (error) {
//         console.error('An error occurred while submitting the form', error);
//         setErrorMessage('An error occurred while submitting the form.');
//         setTimeout(() => {
//           setErrorMessage('');
//         }, 3000);
//       }
//     } else {
//       if (!validatePassword(password)) {
//         setPasswordError('Password must be at least 6 characters, and include one special character, one uppercase letter, and one lowercase letter.');
//       }
//       if (password !== confirmPassword) {
//         setConfirmPasswordError('Passwords do not match.');
//       }
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-left">
//         <a href="/" className="website-name">ShopSavvy</a>
//         <h2></h2>
//       </div>
//       <div className="signup-right">
//         <div className="member-link">
//           <p className="signin-link">Already a member? <a href="/signin">Sign in</a></p>
//         </div>
//         <h2>Sign up to Our Platform</h2>
//         {successMessage && <p className="success">{successMessage}</p>}
//         {errorMessage && <p className="error-big">{errorMessage}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={handlePasswordChange}
//               required
//               />
//             {passwordError && <p className="error">{passwordError}</p>}
//             <input
//               type="password"
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChange={handleConfirmPasswordChange}
//               required
//               />
//             {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}
//           </div>
//           <div className="form-group checkbox-group">
//             <label htmlFor="terms">
//               Creating an account means you're okay with our Terms of Service, Privacy Policy, and our default Notification Settings.
//             </label>
//           </div>
//           <button type="submit">Create Account</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignUp;





// import React, { useState } from 'react';
// import './Signup.css';
// import Header from '../Header/Header'; // Import Header component

// function SignUp() {
//   const [fullName, setFullName] = useState('');
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [confirmPasswordError, setConfirmPasswordError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [genderFilter, setGenderFilter] = useState('');

//   const validatePassword = (password) => {
//     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
//     return regex.test(password);
//   };

//   const handlePasswordChange = (e) => {
//     const newPassword = e.target.value;
//     setPassword(newPassword);
//     if (validatePassword(newPassword)) {
//       setPasswordError('');
//     } else {
//       setPasswordError(
//         'Password must be at least 6 characters, and include one special character, one uppercase letter, and one lowercase letter.'
//       );
//     }
//   };

//   const handleConfirmPasswordChange = (e) => {
//     const newConfirmPassword = e.target.value;
//     setConfirmPassword(newConfirmPassword);
//     if (newConfirmPassword === password) {
//       setConfirmPasswordError('');
//     } else {
//       setConfirmPasswordError('Passwords do not match.');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validatePassword(password) && password === confirmPassword) {
//       const userData = {
//         fullName,
//         username,
//         email,
//         password,
//       };

//       try {
//         const response = await fetch('http://localhost:8000/api/signup', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(userData),
//         });

//         if (response.ok) {
//           setSuccessMessage('Account created successfully.');
//           setFullName('');
//           setUsername('');
//           setEmail('');
//           setPassword('');
//           setConfirmPassword('');
//           setTimeout(() => {
//             setSuccessMessage('');
//           }, 4000);
//           setTimeout(() => {
//             window.location.href = '/';
//           }, 1000);
//         } else {
//           const data = await response.json();
//           setErrorMessage(data.message || 'Failed to create account.');
//           setTimeout(() => {
//             setErrorMessage('');
//           }, 3000);
//         }
//       } catch (error) {
//         console.error('An error occurred while submitting the form', error);
//         setErrorMessage('An error occurred while submitting the form.');
//         setTimeout(() => {
//           setErrorMessage('');
//         }, 3000);
//       }
//     } else {
//       if (!validatePassword(password)) {
//         setPasswordError(
//           'Password must be at least 6 characters, and include one special character, one uppercase letter, and one lowercase letter.'
//         );
//       }
//       if (password !== confirmPassword) {
//         setConfirmPasswordError('Passwords do not match.');
//       }
//     }
//   };

//   return (
//     <div>
//       {/* Render Header */}
//       <Header
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         setGenderFilter={setGenderFilter}
//       />
//       <div className="signup-container">
//         <div className="signup-left">
//           {/* <a href="/" className="website-name">ShopSavvy</a> */}
//           <h2></h2>
//         </div>
//         <div className="signup-right">
//           <div className="member-link">
//             <p className="signin-link">
//               Already a member? <a href="/signin">Sign in</a>
//             </p>
//           </div>
//           <h2>Sign up to Our Platform</h2>
//           {successMessage && <p className="success">{successMessage}</p>}
//           {errorMessage && <p className="error-big">{errorMessage}</p>}
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//               <input
//                 type="email"
//                 placeholder="Email Address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={handlePasswordChange}
//                 required
//               />
//               {passwordError && <p className="error">{passwordError}</p>}
//               <input
//                 type="password"
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={handleConfirmPasswordChange}
//                 required
//               />
//               {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}
//             </div>
//             <div className="form-group checkbox-group">
//               <label htmlFor="terms">
//                 Creating an account means you're okay with our Terms of Service, Privacy Policy, and our default Notification Settings.
//               </label>
//             </div>
//             <button type="submit">Create Account</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUp;










import React, { useState } from 'react';
import './Signup.css';
import Header from '../Header/Header'; // Import Header component

function SignUp() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (validatePassword(newPassword)) {
      setPasswordError('');
    } else {
      setPasswordError(
        'Password must be at least 6 characters, and include one special character, one uppercase letter, and one lowercase letter.'
      );
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (newConfirmPassword === password) {
      setConfirmPasswordError('');
    } else {
      setConfirmPasswordError('Passwords do not match.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validatePassword(password) && password === confirmPassword) {
      const userData = { fullName, username, email, password };

      try {
        const response = await fetch('https://sproj-p14-code.onrender.com/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage(data.message || 'Account created successfully.');
          setFullName('');
          setUsername('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setTimeout(() => {
            setSuccessMessage('');
          }, 4000);
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          setErrorMessage(data.message || 'Failed to create account.');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        }
      } catch (error) {
        console.error('Error during account creation:', error);
        setErrorMessage('An error occurred while submitting the form.');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    } else {
      if (!validatePassword(password)) {
        setPasswordError(
          'Password must be at least 6 characters, and include one special character, one uppercase letter, and one lowercase letter.'
        );
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match.');
      }
    }
  };

  return (
    <div>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setGenderFilter={setGenderFilter}
      />
      <div className="signup-container">
        <div className="signup-right">
          <div className="member-link">
            <p className="signin-link">
              Already a member? <a href="/signin">Sign in</a>
            </p>
          </div>
          <h2>Sign up to Our Platform</h2>
          {successMessage && <p className="success">{successMessage}</p>}
          {errorMessage && <p className="error-big">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {passwordError && <p className="error">{passwordError}</p>}
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}
            </div>
            <div className="form-group checkbox-group">
              <label htmlFor="terms">
                Creating an account means you're okay with our Terms of Service, Privacy Policy, and our default Notification Settings.
              </label>
            </div>
            <button type="submit">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
