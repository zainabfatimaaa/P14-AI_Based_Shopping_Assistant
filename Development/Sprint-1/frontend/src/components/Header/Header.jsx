// // import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import './Header.css';

// // const TOKEN_KEY = 'token';

// // const Header = ({ searchQuery, setSearchQuery }) => {
// //   const navigate = useNavigate();
// //   const token = localStorage.getItem(TOKEN_KEY);

// //   const handleSignUp = () => {
// //     navigate('/signup');
// //   };

// //   const handleSignIn = () => {
// //     navigate('/signin');
// //   };

// //   const handleWishlist = () => {
// //     navigate('/wishlist'); // Navigate to the wishlist page
// //   };

// //   const handleSignOut = () => {
// //     localStorage.removeItem(TOKEN_KEY); // Remove token from localStorage
// //     navigate('/signin'); // Redirect to the sign-in page
// //   };

// //   const handleSearchChange = (event) => {
// //     setSearchQuery(event.target.value); // Update search query in LandingPageC
// //   };

// //   return (
// //     <header className="header">
// //       <div className="logo">
// //         <h1>ShopSavvy</h1>
// //       </div>
// //       <div className="search-bar">
// //         <input
// //           type="text"
// //           placeholder="Search products..."
// //           value={searchQuery} // Bind input to searchQuery state
// //           onChange={handleSearchChange} // Update state on input change
// //         />
// //       </div>
// //       <div className="header-buttons">
// //         {token ? (
// //           <>
// //             <button onClick={handleWishlist}>Wishlist</button>
// //             <button onClick={handleSignOut}>Sign Out</button>
// //           </>
// //         ) : (
// //           <>
// //             <button onClick={handleSignUp}>Create Account</button>
// //             <button onClick={handleSignIn}>Sign In</button>
// //           </>
// //         )}
// //       </div>
// //     </header>
// //   );
// // };

// // export default Header;



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Header.css';

// const TOKEN_KEY = 'token';

// const Header = ({ searchQuery, setSearchQuery }) => {
//   const [showSearch, setShowSearch] = useState(false); // Toggle for search bar
//   const navigate = useNavigate();
//   const token = localStorage.getItem(TOKEN_KEY);

//   const handleSearchToggle = () => {
//     setShowSearch(!showSearch); // Toggle search bar visibility
//   };

//   const handleSignIn = () => {
//     navigate('/signin'); // Navigate to sign-in page
//   };

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value); // Update search query
//   };

//   return (
//     <header className="header">
//       <div className="logo">
//         <h1>ShopSavvy</h1>
//       </div>
//       <nav className="nav-links">
//         <a href="/woman">Woman</a>
//         <a href="/man">Man</a>
//       </nav>
//       <div className="header-icons">
//         <div className="search-icon" onClick={handleSearchToggle}>
//           🔍
//         </div>
//         {showSearch && (
//           <div className="search-bar">
//             <input
//               type="text"
//               placeholder="Search"
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             <button className="close-btn" onClick={handleSearchToggle}>
//               X
//             </button>
//           </div>
//         )}
//         <div className="user-icon" onClick={handleSignIn}>
//           👤
//         </div>
//         <div className="wishlist-icon">🛒</div>
//       </div>
//     </header>
//   );
// };

// export default Header;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import './Header.css';
// import searchIcon from './image22.png'; // Update the path to your first image
// import userIcon from './image11.png'; // Update the path to your human image
// import heartIcon from './image33.png'; // Update the path to your human image


// const TOKEN_KEY = 'token';

// const Header = ({ searchQuery, setSearchQuery, setGenderFilter }) => {
//   const [showSearch, setShowSearch] = useState(false); // Toggle for search bar
//   const navigate = useNavigate(); // Initialize navigate hook
//   const token = localStorage.getItem(TOKEN_KEY);

//   const handleSearchToggle = () => {
//     setShowSearch(!showSearch); // Toggle search bar visibility
//   };

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value); // Update search query
//   };

//   const handleCategoryClick = (gender) => {
//     setGenderFilter(gender); // Update gender filter
//   };

//   const handleSignInClick = () => {
//     navigate('/signin'); // Redirect to SignIn page
//   };

//   return (
//     <header className="header">
//       <div className="logo">
//         <h1>ShopSavvy</h1>
//       </div>
//       <nav className="nav-links">
//         {/* Set gender filter to "Women" or "Men" */}
//         <span onClick={() => handleCategoryClick('Women')}>Women</span>
//         <span onClick={() => handleCategoryClick('Men')}>Men</span>
//       </nav>
//       <div className="header-icons">
//         {/* Replace current search icon with the imported image */}
//         <div className="search-icon" onClick={handleSearchToggle}>
//           <img src={searchIcon} alt="Search Icon" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
//         </div>
//         {showSearch && (
//           <div className="search-bar">
//             <input
//               type="text"
//               placeholder="Search"
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             <button className="close-btn" onClick={handleSearchToggle}>
//               X
//             </button>
//           </div>
//         )}
//         {/* Redirect to SignInC page on clicking the human icon */}
//         <div className="user-icon" onClick={handleSignInClick}>
//           <img src={userIcon} alt="User Icon" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
//         </div>
//         {/* Replace shopping cart icon with an image */}
//         <div className="cart-icon" onClick={() => navigate('/cart')}>
//           <img src={cartIcon} alt="Cart Icon" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;





import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Header.css';
import searchIcon from './image22.png'; // Update the path to your first image
import userIcon from './image11.png'; // Update the path to your human image
import heartIcon from './image44.png'; // Update the path to your human image

const TOKEN_KEY = 'token';

const Header = ({ searchQuery, setSearchQuery, setGenderFilter }) => {
  const [showSearch, setShowSearch] = useState(false); // Toggle for search bar
  const navigate = useNavigate(); // Initialize navigate hook
  const token = localStorage.getItem(TOKEN_KEY);

  const handleSearchToggle = () => {
    setShowSearch(!showSearch); // Toggle search bar visibility
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query
  };

  const handleCategoryClick = (gender) => {
    setGenderFilter(gender); // Update gender filter
  };

  const handleSignInClick = () => {
    navigate('/signin'); // Redirect to SignIn page
  };

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the LandingPageC
  };

  const handleWishlistClick = () => {
    navigate('/wishlist'); // Navigate to Wishlist page
  };

  return (
    <header className="header">
      {/* Update logo to make it clickable */}
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <h1>ShopSavvy</h1>
      </div>
      <nav className="nav-links">
        {/* Set gender filter to "Women" or "Men" */}
        <span onClick={() => handleCategoryClick('Women')}>Women</span>
        <span onClick={() => handleCategoryClick('Men')}>Men</span>
      </nav>
      <div className="header-icons">
        {/* Replace current search icon with the imported image */}
        <div className="search-icon" onClick={handleSearchToggle}>
          <img src={searchIcon} alt="Search Icon" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
        </div>
        {showSearch && (
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="close-btn" onClick={handleSearchToggle}>
              X
            </button>
          </div>
        )}
        {/* Redirect to SignIn page on clicking the human icon */}
        <div className="user-icon" onClick={handleSignInClick}>
          <img src={userIcon} alt="User Icon" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
        </div>
        {/* Redirect to Wishlist page on clicking the heart icon */}
        <div className="wishlist-icon" onClick={handleWishlistClick}>
          <img src={heartIcon} alt="Wishlist Icon" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
        </div>
      </div>
    </header>
  );
};

export default Header;
