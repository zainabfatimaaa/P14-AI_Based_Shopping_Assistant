import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';
import Header from '../Header/Header'; // Importing Header component

// Updated unique colors and sizes
const uniqueColors = [
  'Grey', 'White', 'Red', 'Green', 'Brown', 'Black', 'Blue', 'Beige', 'Orange',
  'Pink', 'Yellow', 'Purple', 'Multi-color', 'Other'
];

const uniqueSizes = [
  'S', 'M', 'L', 'XL', '2XL', 'XS', '3XL', '4XL', '30', '32', '34', '36', '38', '40', 
  '28', '33', '24', '26', 'S-M', 'L-XL', 'M-L', 'XS-S'
];

// New unique types for 'type' filter
const uniqueTypes = [
  'T-Shirt', 'Hoodies & Sweatshirts', 'Sweaters & Cardigans', 'Jackets & Coats', 'Blazers', 'Polo',
  'Shirts', 'Trousers', 'Jeans', 'Shorts', 'Fur & Fleece', 'Bodysuits', 'Dresses & Skirts', 
  'Camisole & Bandeaus', 'Tops & Blouses', 'TrueBody', 'Activewear', 'Co-ords'
];

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [productsPerRow, setProductsPerRow] = useState(4);
  const [nameSortOption, setNameSortOption] = useState('none');
  const [priceSortOption, setPriceSortOption] = useState('none');
  const [genderFilter, setGenderFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:8000/api/wishlist', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch wishlist:', await response.text());
        return;
      }

      const data = await response.json();
      setWishlist(data.wishlist); // Assuming response contains wishlist array with full product details
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/wishlist/add/${productId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist);
      } else {
        console.error('Failed to add to wishlist:', await response.text());
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:10000/api//wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setWishlist((prevWishlist) => prevWishlist.filter((product) => product._id !== productId));
        fetchWishlist();
      } else {
        console.error('Failed to remove from wishlist:', await response.text());
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleProductsPerRowChange = (event) => {
    setProductsPerRow(Number(event.target.value));
  };

  const handleNameSortChange = (event) => {
    setNameSortOption(event.target.value);
  };

  const handlePriceSortChange = (event) => {
    setPriceSortOption(event.target.value);
  };

  const handleGenderFilterChange = (event) => {
    setGenderFilter(event.target.value);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };

  const handleColorFilterChange = (event) => {
    setColorFilter(event.target.value);
  };

  const handleSizeFilterChange = (event) => {
    setSizeFilter(event.target.value);
  };

  const sortedWishlist = [...wishlist]
    .filter(product => {
      if (genderFilter !== 'all' && product.gender !== genderFilter) return false;
      if (typeFilter !== 'all' && product.type !== typeFilter) return false;
      if (colorFilter !== 'all' && product.primary_color !== colorFilter) return false;
      if (sizeFilter !== 'all' && !product.sizes.includes(sizeFilter)) return false;
      return true;
    })
    .sort((a, b) => {
      if (nameSortOption !== 'none') {
        const nameComparison = a.product.localeCompare(b.product);
        if (nameSortOption === 'name-asc') return nameComparison;
        if (nameSortOption === 'name-desc') return -nameComparison;
      }

      if (priceSortOption !== 'none') {
        const priceComparison = a.price - b.price;
        if (priceSortOption === 'price-asc') return priceComparison;
        if (priceSortOption === 'price-desc') return -priceComparison;
      }

      return 0;
    });

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="products-container">
        <div className="filters-container">
          
          <div className="options">
            <label htmlFor="price-sort-by">Price: </label>
            <select id="price-sort-by" onChange={handlePriceSortChange} value={priceSortOption}>
              <option value="none">Price</option>
              <option value="price-asc">Price low to high</option>
              <option value="price-desc">Price high to low</option>
            </select>
          </div>
          <div className="options">
            <label htmlFor="type-filter">Filter by Type: </label>
            <select id="type-filter" onChange={handleTypeFilterChange} value={typeFilter}>
              <option value="all">Category</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="options">
            <label htmlFor="color-filter">Filter by Color: </label>
            <select id="color-filter" onChange={handleColorFilterChange} value={colorFilter}>
              <option value="all">Colour</option>
              {uniqueColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
          <div className="options">
            <label htmlFor="size-filter">Filter by Size: </label>
            <select id="size-filter" onChange={handleSizeFilterChange} value={sizeFilter}>
              <option value="all">Size</option>
              {uniqueSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
        <h2>Your Wishlist</h2>
        <div className="products-grid" style={{ gridTemplateColumns: `repeat(${productsPerRow}, 1fr)` }}>
          {sortedWishlist.map((product) => (
            <div 
              key={product._id} 
              className="product-card" 
              onClick={() => handleCardClick(product._id)}
            >
              <img 
                src={product.images[0]} 
                alt={product.product} 
                className="product-image"
              />
              <div className="product-info">
                <h3 className="product-name">{product.product}</h3>
                <p className="product-price">Rs. {product.price}</p>
              </div>
              <button 
                className="remove-btn" 
                onClick={(e) => { 
                  e.stopPropagation();
                  removeFromWishlist(product._id);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default WishlistPage;
