import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';

const TOKEN_KEY = 'token';

const categories = {
  Men: {
    Uppers: ["T-Shirt", "Polo", "Shirts", "Sweaters & Cardigans", "Hoodies & Sweatshirts", "Jackets & Coats", "Blazers", "Activewear"],
    Bottoms: ["Jeans", "Trousers", "Shorts"]
  },
  Women: {
    Uppers: ["T-Shirt", "Camisole & Bandeaus", "Tops & Blouses", "Shirts", "Sweaters & Cardigans", "Hoodies & Sweatshirts", "Jackets & Coats", "Blazers", "Activewear", "Bodysuits", "Co-ords", "Dresses & Skirts", "Fur & Fleece"],
    Bottoms: ["Jeans", "Trousers", "Shorts", "Studio", "TrueBody"]
  }
};

const Header = ({ setGenderFilter, setCategoryFilter }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGender, setSelectedGender] = useState("Men"); // Default to Men
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const token = localStorage.getItem(TOKEN_KEY);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setSelectedType(null); // Reset selection when switching gender
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type === selectedType ? null : type); // Toggle selection
  };

  const handleCategoryClick = (category) => {
    setGenderFilter(selectedGender);
    setCategoryFilter(category);
    setShowDropdown(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
    if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
      setIsUserDropdownOpen(false);
    }
  };

  const handleUserClick = () => {
    if (token) {
      setIsUserDropdownOpen(!isUserDropdownOpen);
    } else {
      navigate('/signin');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsUserDropdownOpen(false);
    navigate('/signin');
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
        <h1>Shop Savvy</h1>
      </div>

      {/* Dropdown Menu */}
      <div className="menu-container" ref={dropdownRef}>
        <div className="menu-icon" onClick={toggleDropdown}>
          &#9776;
        </div>

        {showDropdown && (
          <div className="dropdown-menu">
            {/* Gender Selection */}
            <div className="gender-selection">
              <span className={selectedGender === "Men" ? "selected" : ""} onClick={() => handleGenderSelect("Men")}>Men</span>
              <span className={selectedGender === "Women" ? "selected" : ""} onClick={() => handleGenderSelect("Women")}>Women</span>
            </div>

            <div className="subcategory-selection">
              <span className={selectedType === "Uppers" ? "selected" : ""} onClick={() => handleTypeSelect("Uppers")}>Uppers</span>
              <span className={selectedType === "Bottoms" ? "selected" : ""} onClick={() => handleTypeSelect("Bottoms")}>Bottoms</span>
            </div>

            {selectedType && (
              <div className="category-list">
                {categories[selectedGender][selectedType].map((category, index) => (
                  <div key={index} onClick={() => handleCategoryClick(category)} className="dropdown-item">
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Header Icons */}
      <div className="header-icons">
        {/* Search Icon */}
        <div className="search-icon" onClick={() => setSearchQuery('')}>
          <img src={'./image22.png'} alt="Search" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
        </div>

        {/* User Dropdown */}
        <div className="user-icon-container" ref={userDropdownRef}>
          <div className="user-icon" onClick={handleUserClick}>
            <img src={'./image11.png'} alt="User" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
          </div>

          {isUserDropdownOpen && token && (
            <div className="user-dropdown-menu">
              <Link to="/profile" className="dropdown-item">Manage Account</Link>
              <div className="dropdown-item" onClick={handleSignOut}>Sign Out</div>
            </div>
          )}
        </div>

        {/* Wishlist Icon */}
        <div className="wishlist-icon" onClick={() => navigate('/wishlist')}>
          <img src={'./image44.png'} alt="Wishlist" style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
        </div>
      </div>
    </header>
  );
};

export default Header;
