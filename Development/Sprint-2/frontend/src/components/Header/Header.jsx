


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import searchIcon from './image22.png';
import userIcon from './image11.png';
import heartIcon from './image44.png';

const TOKEN_KEY = 'token';

// Example categories retrieved from the database
const categories = [
  "Activewear", "Blazers", "Bodysuits", "Camisole & Bandeaus", "Co-ords", "Dresses & Skirts",
  "Fur & Fleece", "Hoodies & Sweatshirts", "Jackets & Coats", "Jeans", "Polo", "Shirts",
  "Shorts", "Sweaters & Cardigans", "T-Shirt", "Tops & Blouses", "Trousers", "TrueBody"
];

const Header = ({ searchQuery, setSearchQuery, setGenderFilter, setCategoryFilter }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const token = localStorage.getItem(TOKEN_KEY);


    // ✅ Close category menu when a category is selected
    const handleCategoryClick = (gender) => {
      setGenderFilter(gender); // Update gender filter in LandingPageC.jsx
      setSelectedGender(gender); // Show the category menu for the selected gender
      setShowDropdown(false); // Close the main dropdown menu
    };
  
    // ✅ Close both menus when a category is clicked
    const handleCategoryFilterClick = (category) => {
      setCategoryFilter(category); // Update category filter in LandingPageC.jsx
      setSelectedGender(null); // Close the category menu
    };
  
    // ✅ Toggle the main menu and close the category menu if open
    const toggleDropdown = () => {
      setShowDropdown(!showDropdown); // Toggle the main dropdown menu
      setSelectedGender(null); // Close the category menu when toggling the main menu
    };


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
      setSelectedGender(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <h1>ShopSavvy</h1>
      </div>
      
      {/* Dropdown Menu */}
      <div className="menu-container" ref={dropdownRef}>
        <div className="menu-icon" onClick={() => setShowDropdown(!showDropdown)}>
          &#9776;
        </div>
        
        {showDropdown && (
          <div className="dropdown-menu">
            <span onClick={() => handleCategoryClick('Women')}>Women</span>
            <span onClick={() => handleCategoryClick('Men')}>Men</span>
          </div>
        )}

        {selectedGender && (
          <div className="category-dropdown">
            <h3>{selectedGender} Categories</h3>
            <ul>
              {categories.map((category, index) => (
                <li key={index} onClick={() => handleCategoryFilterClick(category)}>
                  {category}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="header-icons">
        <div className="search-icon" onClick={() => setSearchQuery('')}>
          <img src={searchIcon} alt="Search" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
        </div>
        <div className="user-icon" onClick={() => navigate('/signin')}>
          <img src={userIcon} alt="User" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
        </div>
        <div className="wishlist-icon" onClick={() => navigate('/wishlist')}>
          <img src={heartIcon} alt="Wishlist" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
        </div>
      </div>
    </header>
  );
};

export default Header;