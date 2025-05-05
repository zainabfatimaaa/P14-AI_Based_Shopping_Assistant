import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Fuse from "fuse.js";
import "./ProductsDisplay.css"; // You can use the same CSS as ProductsDisplay
import ProductFilters from "../Filters/ProductFilters";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const TOKEN_KEY = "token";

function SearchResultsPage({
  products, currentPage, setCurrentPage,
  colorFilters, setColorFilters,
  sizeFilters, setSizeFilters,
  brandFilters, setBrandFilters,
  priceSortOption, setPriceSortOption,
  alphabeticalSortOption, setAlphabeticalSortOption,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  blockId,
}) {
  const productsPerPage = 20;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem(TOKEN_KEY);

  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(""); 
  const [wishlistIds, setWishlistIds] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  useEffect(() => {
    // Extract search term from the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const term = queryParams.get("search") || "";
    setSearchTerm(term);
    setSubmittedSearchTerm(term);
    setCurrentPage(1); // Reset to page 1 on new search
  }, [location.search]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
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
  }, [token]);

  const fuseOptions = {
    keys: ["product"],
    threshold: 0.4,
    getFn: (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj),
  };

  const fuse = useMemo(() => new Fuse(products, fuseOptions), [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Perform the search filtering
    if (submittedSearchTerm) {
      const fuseResults = fuse.search(submittedSearchTerm);
      result = fuseResults.map((res) => res.item);
    }

    // Apply other filters like color, size, brand, etc.
    result = result.filter((product) => {
      if (colorFilters.length > 0 && !colorFilters.includes(product.filtercolor)) return false;
      if (sizeFilters.length > 0 && !sizeFilters.some(size => product.sizes.includes(size))) return false;
      if (brandFilters.length > 0 && !brandFilters.includes(product.brand)) return false;
      if (product.price < minPrice || product.price > maxPrice) return false;
      return true;
    });

    // Sorting logic
    result = result.sort((a, b) => {
      if (priceSortOption === "price-asc") return a.price - b.price;
      if (priceSortOption === "price-desc") return b.price - a.price;
      if (alphabeticalSortOption === "A-Z") return a.product.localeCompare(b.product);
      if (alphabeticalSortOption === "Z-A") return b.product.localeCompare(a.product);
      return 0;
    });

    return result;
  }, [products, submittedSearchTerm, colorFilters, sizeFilters, brandFilters, priceSortOption, alphabeticalSortOption, minPrice, maxPrice, fuse]);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const toggleWishlist = async (productId) => {
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
          isInWishlist ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  return (
    <div className="products-container">
      <div className="top-bar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setSubmittedSearchTerm(searchTerm)}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        {!showFilters && (
          <div className="filter-icon-wrapper" onClick={(e) => {
            e.stopPropagation();
            setShowFilters(true);
          }}>
            <FontAwesomeIcon icon={faFilter} className="filter-icon" title="Filters" />
          </div>
        )}
      </div>

      {showFilters && (
        <>
          <div className="filter-overlay" onClick={() => setShowFilters(true)} />
          <div className="filters-sidebar" onClick={(e) => e.stopPropagation()}>
            <ProductFilters
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
            />
          </div>
        </>
      )}

      <div className="products-grid">
        {currentProducts.map((product) => (
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
                      onClick={(e) => window.open(product.link, "_blank")}
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

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default SearchResultsPage;
