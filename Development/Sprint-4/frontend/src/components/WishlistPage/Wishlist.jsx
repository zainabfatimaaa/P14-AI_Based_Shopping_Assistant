import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';
import Header from '../Header/Header'; // Importing Header component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

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
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:10000/api/wishlist', {
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
        ? `http://localhost:10000/api/wishlist/remove/${productId}`
        : `http://localhost:10000/api/wishlist/add/${productId}`;

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
          isInWishlist
            ? prev.filter((id) => id !== productId)
            : [...prev, productId]
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
    console.log('[DEBUG] Clicked product:', clickedProduct);
  
    if (!clickedProduct) return;
  
    const message = clickedProduct.message || clickedProduct?.product?.message;
    console.log('[DEBUG] Product message:', message);
  
    if (message === 'Product not available') {
      const targetId = clickedProduct.productId || clickedProduct._id;
      navigate(`/product/unavailable/${targetId}`);
    } else {
      const targetId = clickedProduct.productId || clickedProduct._id;
      navigate(`/product/${targetId}`);
    }
  };
  
  

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
                <p className="product-price">Rs. {product.price}</p>

                {/* Check for message attribute and adjust UI */}
                {product.message && product.message === 'Product not available' ? (
                  <p className="product-message">Product not available</p>
                ) : (
                  <>
                    {/* Product Actions */}
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
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default WishlistPage;
