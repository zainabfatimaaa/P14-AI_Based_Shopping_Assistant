import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';
import Header from '../Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Footer from "../Footer/Footer.jsx"; 

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [productsPerRow, setProductsPerRow] = useState(4);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found');
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch('https://sproj-p14-code.onrender.com/api/wishlist', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch wishlist:', await response.text());
        return;
      }

      const data = await response.json();
      setWishlist(data.wishlist);
      setWishlistIds(data.wishlist.map(product => product._id));
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    const isInWishlist = wishlistIds.includes(productId);

    try {
      const url = isInWishlist
        ? `https://sproj-p14-code.onrender.com/api/wishlist/remove/${productId}`
        : `https://sproj-p14-code.onrender.com/api/wishlist/add/${productId}`;

      const method = isInWishlist ? "DELETE" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setWishlistIds((prev) =>
          isInWishlist ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
      } else {
        console.error("Failed to update wishlist.");
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  const handleCardClick = (productId) => {
    const clickedProduct = wishlist.find(p => p._id === productId || p.productId === productId);
    if (!clickedProduct) return;

    const message = clickedProduct.message || clickedProduct?.product?.message;
    const targetId = clickedProduct.productId || clickedProduct._id;

    if (message === 'Product not available') {
      navigate(`/product/unavailable/${targetId}`);
    } else {
      navigate(`/product/${targetId}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="wishlist-message-container">
          <h2 className="wishlist-message-title">Your Wishlist is Waiting!</h2>
          <p className="wishlist-message-text">Sign in or sign up to save and view your personalized wishlist.</p>
          <button className="signin-btn" onClick={() => navigate('/signin')}>
            Sign In
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="products-container">
        <h2>Your Wishlist</h2>
        <div className="products-grid" style={{ gridTemplateColumns: `repeat(${productsPerRow}, 1fr)` }}>
          {wishlist.map((product) => (
            <div
              key={product._id || product.productId}
              className="product-card"
              onClick={() => handleCardClick(product._id || product.productId)}
            >
              <img
                src={product.images[0]}
                alt={product.product}
                className="product-image"
              />
              <div className="product-info">
                <h3 className="product-name">{product.product}</h3>
                <p className="product-brand">{product.brand}</p>
                <p className="product-price">Rs. {product.price}</p>

                {product.message === 'Product not available' ? (
                  <p className="product-message">Product not available</p>
                ) : (
                  <div className="product-actions">
                    <div className="icon-container">
                      <button
                        className={`wishlist-button ${wishlistIds.includes(product._id) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product._id);
                        }}
                        title="Add to Wishlist"
                      >
                        <FontAwesomeIcon icon={wishlistIds.includes(product._id) ? solidHeart : regularHeart} />
                      </button>

                      {product.link && (
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-link-button"
                          onClick={(e) => e.stopPropagation()}
                          title="Visit Product Page"
                        >
                          <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
    
  );
}

export default WishlistPage;