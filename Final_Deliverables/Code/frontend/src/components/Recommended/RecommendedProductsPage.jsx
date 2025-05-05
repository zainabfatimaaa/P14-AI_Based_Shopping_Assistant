import React, { useEffect, useState } from "react";
import Header from "../Header/Header.jsx";
import ChatbotIcon from "../ChatBot/ChatbotIcon.jsx";
import ChatbotI from "../ChatBot/ChatbotI.jsx";
import { useNavigate } from "react-router-dom";
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import "../ProductDisplay/ProductsDisplay.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const RecommendedProductsPage = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const navigate = useNavigate();
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://sproj-p14-code.onrender.com/api/wishlist", {
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
      ? `https://sproj-p14-code.onrender.com/api/wishlist/remove/${productId}`
      : `https://sproj-p14-code.onrender.com/api/wishlist/add/${productId}`;
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

  // Fetch recommended products from localStorage or backend on mount
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("recommendedProducts"));
    const userId = localStorage.getItem("userId");

    if (storedProducts) {
      setRecommendedProducts(storedProducts);
    } else {
      async function fetchRecommendedProducts() {
        try {
          const response = await fetch("https://sproj-p14-code.onrender.com/api/recommended-products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });
          const data = await response.json();
          localStorage.setItem("recommendedProducts", JSON.stringify(data));
          setRecommendedProducts(data);
        } catch (error) {
          console.error("Error fetching recommended products:", error);
        }
      }

      fetchRecommendedProducts();
    }
  }, []);

  // Background refresh if 15+ minutes have passed
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const lastUpdated = localStorage.getItem("recommendationLastUpdated");
    const now = Date.now();

    if (!lastUpdated || now - parseInt(lastUpdated) > 15 * 60 * 1000) {
      fetch("https://sproj-p14-code.onrender.com/api/recommended-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("recommendedProducts", JSON.stringify(data));
          localStorage.setItem("recommendationLastUpdated", now.toString());
          console.log("Recommendations refreshed in background.");
        })
        .catch((err) => {
          console.error("Failed to refresh recommendations:", err);
        });
    }
  }, []);

  return (
    <>
      <Header />
      <div className="products-container">
        {recommendedProducts?.length > 0 && (
            <section className="top-picks-section">
            <h2 className="section-heading">Recommended Products</h2>
            {renderProducts(recommendedProducts)}
            </section>
        )}
        </div>
      <ChatbotIcon onClick={() => setIsChatbotOpen(!isChatbotOpen)} />
      {isChatbotOpen && (
        <div className="chatbot-window-container">
          <ChatbotI />
          <button className="close-chatbot-btn" onClick={() => setIsChatbotOpen(false)}>
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default RecommendedProductsPage;
