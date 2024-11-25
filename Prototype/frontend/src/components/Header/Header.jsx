// // Header.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Header.css';

// const Header = ({ searchQuery, setSearchQuery }) => {
//   const navigate = useNavigate();

//   const handleSignUp = () => {
//     navigate('/signup');
//   };

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value); // Update search query in LandingPageC
//   };

//   return (
//     <header className="header">
//       <div className="logo">
//         <h1>ShopSavvy</h1>
//       </div>
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={searchQuery} // Bind input to searchQuery state
//           onChange={handleSearchChange} // Update state on input change
//         />
//       </div>
//       <div className="signup-button">
//         <button onClick={handleSignUp}>Sign Up</button>
//       </div>
//     </header>
//   );
// };

// export default Header;




// Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query in LandingPageC
  };

  const handleWishlist = () => {
    navigate('/wishlist'); // Navigate to the wishlist page
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>ShopSavvy</h1>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery} // Bind input to searchQuery state
          onChange={handleSearchChange} // Update state on input change
        />
      </div>
      <div className="header-buttons">
        <button onClick={handleWishlist}>Wishlist</button> {/* New Wishlist button */}
        <button onClick={handleSignUp}>Sign Up</button>
      </div>
    </header>
  );
};

export default Header;
