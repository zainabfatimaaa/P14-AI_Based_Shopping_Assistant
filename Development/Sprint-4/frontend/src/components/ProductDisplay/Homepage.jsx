import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductsDisplay.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

function ProductsDisplay({ product, recommendedProducts }) {
  const navigate = useNavigate();
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:10000/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setWishlistIds(data.wishlist.map((item) => item._id));
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
    fetchWishlist();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    const isInWishlist = wishlistIds.includes(productId);
    const url = isInWishlist
      ? `http://localhost:10000/api/wishlist/remove/${productId}`
      : `http://localhost:10000/api/wishlist/add/${productId}`;
    const method = isInWishlist ? "DELETE" : "POST";

    try {
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
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  const handleExternalLinkClick = (e, product) => {
    e.stopPropagation();
    window.open(product.link, "_blank", "noopener,noreferrer");
  };

  const renderProducts = (productsList) => (
    <div className="products-grid">
      {productsList.map((product) => (
        <div
          key={product._id}
          className="product-card"
          onClick={() => handleProductClick(product._id)}
        >
          <img
            src={product.images?.[0] || "/default-image.jpg"}
            alt={product.product || "Product"}
            className="product-image"
          />
          <div className="product-info">
            <h3>{product.product}</h3>
            <p>{product.brand}</p>
            <p>Rs. {product.price}</p>
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
                  <button
                    className="external-link-button"
                    onClick={(e) => handleExternalLinkClick(e, product)}
                    title="Visit Product Page"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="products-container">
      {recommendedProducts?.length > 0 && (
        <section className="top-picks-section">
          <h2 className="section-heading">Top Picks for You</h2>
          {renderProducts(recommendedProducts.slice(0, 16))}
  
          {recommendedProducts.length > 12 && (
            <div className="view-all-container">
              <button
                className="view-all-button"
                onClick={() => navigate("/recommendations")}
              >
                View All
              </button>
            </div>
          )}
        </section>
      )}
  
      {product?.length > 0 && (
        <section className="all-products-section">
          <h2 className="section-heading">All Products</h2>
          {renderProducts(product.slice(0, 16))}
  
          {product.length > 16 && (
            <div className="view-all-container">
              <button
                className="view-all-button"
                onClick={() => navigate("/all-products")}
              >
                View All
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
  
}

export default ProductsDisplay;
