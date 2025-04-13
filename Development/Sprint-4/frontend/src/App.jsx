// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
// import './App.css';
// import LandingPageC from './components/AuthPages/LandingPageC.jsx';
// import SignUpC from './components/AuthPages/SignUpC.jsx';
// import SignInC from './components/AuthPages/SignInC.jsx';
// import ProductsDisplay from './components/ProductDisplay/ProductsDisplay.jsx'
// import ProductDets from './components/ProductDetails/ProductDets.jsx'; 
// import WishlistPage from './components/WishlistPage/Wishlist.jsx';
// import ChatbotI from "./components/ChatBot/ChatbotI.jsx";
// import ProfileC from "./components/AuthPages/ProfileC.jsx";
// import {jwtDecode} from 'jwt-decode';
// import useInactivityTimeout from './components/InactivityTimeout/useInactivityTimeout.jsx';
// import ProductDetailsUnavailable from './components/ProductDetails/ProductDetailsUnavailable.jsx';


// const TOKEN_KEY = 'token';
// const INACTIVITY_TIMEOUT = 0.1 * 60 * 1000;

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<LandingPageC />} />
//           <Route path="/:genderCategory" element={<LandingPageC />} />
//           <Route path="/signup" element={<SignUpC />} />
//           <Route path="/signin" element={<SignInC />} />
//           <Route path="/products" element={<ProductsDisplay />} />
//           <Route path="/product/:id" element={<ProductDets />} />
//           <Route path="/wishlist" element={<WishlistPage />} />
//           <Route path="/chatbot" element={<ChatbotI />} />
//           <Route path="/profile" element={<ProfileC />} />
//           <Route path="/product/unavailable/:id" element={<ProductDetailsUnavailable />} />


//         </Routes>
//       </div>
//     </Router>
//   );
// }

// function MainPage() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();


//   useEffect(() => {
//     const token = localStorage.getItem(TOKEN_KEY);
//     const lastActivity = localStorage.getItem('lastActivity');
    
//     if (token) {
//       const { exp } = jwtDecode(token);
//       if (Date.now() >= exp * 1000 || (lastActivity && Date.now() - lastActivity > INACTIVITY_TIMEOUT)) {
//         localStorage.removeItem(TOKEN_KEY);
//         localStorage.clear();
//         localStorage.removeItem('lastActivity');
//         setIsLoggedIn(false);
//       } else {
//         setIsLoggedIn(true);
//       }
//     } else {
//       setIsLoggedIn(false);
//       navigate('/wishlist'); 
//     }

//   }, []);

//   const handleTimeout = () => {
//     localStorage.clear();
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem('lastActivity');
//     setIsLoggedIn(false);
//     window.location.reload();
//     // navigate('/wishlist');
//   };

//   useInactivityTimeout(INACTIVITY_TIMEOUT, handleTimeout);

//   return (
//     <>
//       {isLoggedIn ? <LandingPageC /> : <WishlistPage /> }
//     </>
//   );
// }

// export default App;




import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import LandingPageC from './components/AuthPages/LandingPageC.jsx';
import SignUpC from './components/AuthPages/SignUpC.jsx';
import SignInC from './components/AuthPages/SignInC.jsx';
import ProductsDisplay from './components/ProductDisplay/ProductsDisplay.jsx';
import ProductDets from './components/ProductDetails/ProductDets.jsx';
import WishlistPage from './components/WishlistPage/Wishlist.jsx';
import ChatbotI from "./components/ChatBot/ChatbotI.jsx";
import ProfileC from "./components/AuthPages/ProfileC.jsx";
import { jwtDecode } from 'jwt-decode';
import useInactivityTimeout from './components/InactivityTimeout/useInactivityTimeout.jsx';

const TOKEN_KEY = 'token';
const INACTIVITY_TIMEOUT = 0.1 * 60 * 1000;

function App() {
  const [colorFilters, setColorFilters] = useState([]);
  const [sizeFilters, setSizeFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [priceSortOption, setPriceSortOption] = useState("");
  const [alphabeticalSortOption, setAlphabeticalSortOption] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPageC />} />
          <Route path="/:genderCategory" element={<LandingPageC />} />
          <Route path="/signup" element={<SignUpC />} />
          <Route path="/signin" element={<SignInC />} />
          <Route path="/products" element={
            <ProductsDisplay
              colorFilters={colorFilters}
              setColorFilters={setColorFilters}
              sizeFilters={sizeFilters}
              setSizeFilters={setSizeFilters}
              brandFilters={brandFilters}
              setBrandFilters={setBrandFilters}
              priceSortOption={priceSortOption}
              setPriceSortOption={setPriceSortOption}
              alphabeticalSortOption={alphabeticalSortOption}
              setAlphabeticalSortOption={setAlphabeticalSortOption}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              blockId="products-page"
            />
          } />
          <Route path="/product/:id" element={<ProductDets />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/chatbot" element={<ChatbotI />} />
          <Route path="/profile" element={<ProfileC />} />
        </Routes>
      </div>
    </Router>
  );
}

function MainPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const lastActivity = localStorage.getItem('lastActivity');
    
    if (token) {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000 || (lastActivity && Date.now() - lastActivity > INACTIVITY_TIMEOUT)) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.clear();
        localStorage.removeItem('lastActivity');
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    } else {
      setIsLoggedIn(false);
      navigate('/wishlist'); 
    }
  }, []);

  const handleTimeout = () => {
    localStorage.clear();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('lastActivity');
    setIsLoggedIn(false);
    window.location.reload();
  };

  useInactivityTimeout(INACTIVITY_TIMEOUT, handleTimeout);

  return (
    <>
      {isLoggedIn ? <LandingPageC /> : <WishlistPage /> }
    </>
  );
}

export default App;