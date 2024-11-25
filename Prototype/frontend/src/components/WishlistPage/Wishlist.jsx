import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [productsPerRow, setProductsPerRow] = useState(4);
  const [sortOption, setSortOption] = useState('name-asc');
  const navigate = useNavigate();

  // Fetch the wishlist products from the backend
  useEffect(() => {
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
    fetchWishlist();
  }, []);

  // Function to add a product to the wishlist
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

  // Function to remove a product from the wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist);
      } else {
        console.error('Failed to remove from wishlist:', await response.text());
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Handle change of products per row
  const handleProductsPerRowChange = (event) => {
    setProductsPerRow(Number(event.target.value));
  };

  // Handle sorting change
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Sort wishlist items based on selected option
  const sortedWishlist = [...wishlist].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Navigate to product details page when a product card is clicked
  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="products-container">
      <h2>Your Wishlist</h2>
      <div className="options">
        <label htmlFor="products-per-row">Products per row: </label>
        <select id="products-per-row" onChange={handleProductsPerRowChange} value={productsPerRow}>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
      <div className="options">
        <label htmlFor="sort-by">Sort By: </label>
        <select id="sort-by" onChange={handleSortChange} value={sortOption}>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
        </select>
      </div>
      <div className="products-grid" style={{ gridTemplateColumns: `repeat(${productsPerRow}, 1fr)` }}>
        {sortedWishlist.map((product) => (
          <div 
            key={product._id} 
            className="product-card" 
            onClick={() => handleCardClick(product._id)}
          >
            <img
              src={product.image || '/images/kurta.jpg'} // Placeholder or actual product image
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-brand">{product.brand}</p>
              <p className="product-price">₹{product.price}</p>
            </div>
            <div className="product-actions">
              <button className="cart-button">
                <i className="fas fa-cart-plus"></i>
              </button>
              {wishlist.some((item) => item._id === product._id) ? (
                <button className="wishlist-button" onClick={(e) => { e.stopPropagation(); removeFromWishlist(product._id); }}>
                  <i className="fas fa-heart-broken"></i> {/* Indicates removal from wishlist */}
                </button>
              ) : (
                <button className="wishlist-button" onClick={(e) => { e.stopPropagation(); addToWishlist(product._id); }}>
                  <i className="fas fa-heart"></i> {/* Indicates addition to wishlist */}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;

