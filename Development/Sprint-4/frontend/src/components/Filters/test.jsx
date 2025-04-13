import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import "./ProductsDisplay.css";
import { FaHeart, FaRegHeart, FaExternalLinkAlt } from 'react-icons/fa';


// Unique options used for filtering
const uniqueColors = [
  "Black", "White", "Grey", "Beige",
  "Red", "Pink", "Orange", "Yellow",
  "Green", "Blue", "Purple",
  "Brown", "Multi-color", "Other"
];
const uniqueBrands = ["LAMA", "Outfitters"];
const uniqueSizes = [
  "S", "M", "L", "XL", "2XL", "XS", "3XL", "4XL", 
  "30", "32", "34", "36", "38", "40", 
  "28", "33", "24", "26", "S-M", "L-XL", "M-L", "XS-S"
];

const TOKEN_KEY = "token";
const FILTERS_STORAGE_KEY = "userFilters";

let debounceTimer;

// Helper function to normalize strings by lowercasing and removing special characters
const normalizeString = (str) =>
  str.toLowerCase().replace(/[^a-z0-9\s]/g, "");

// Custom debounce hook to delay updates until the user finishes typing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

function ProductsDisplay({
  products, currentPage, setCurrentPage,
  colorFilters, setColorFilters,
  sizeFilters, setSizeFilters,
  brandFilters, setBrandFilters,
  priceSortOption, setPriceSortOption,
  alphabeticalSortOption, setAlphabeticalSortOption,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  blockId
}) {
  const productsPerPage = 20;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const navigate = useNavigate();
  const token = localStorage.getItem(TOKEN_KEY);

  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const [typeFilter, setTypeFilter] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  // (Optional: You can remove the debounce hook if not needed anymore
  // const debouncedSearchTerm = useDebounce(searchTerm, 300); )

  // Reset current page to 1 whenever a new submitted search term is set
  useEffect(() => {
    setCurrentPage(1);
  }, [submittedSearchTerm, setCurrentPage]);

  // Dropdown toggles for filtering UI
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isAlphabeticalDropdownOpen, setIsAlphabeticalDropdownOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);


  // Fetch recommended products (this logic remains unchanged)
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        console.log("Fetching recommended product IDs...");
        const inputText = "I am looking for casual dresses in medium size, red color, and cotton material.";
        const response = await fetch("http://127.0.0.1:8000/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input_text: inputText }),
        });
        const productIds = await response.json();
        console.log("Received product IDs:", productIds);
        if (!Array.isArray(productIds) || productIds.length === 0) {
          console.warn("No recommended products received.");
          return;
        }
        const fetchProductDetails = async (id) => {
          try {
            const res = await fetch(`https://sproj-p14-code.onrender.com/api/fetchproducts/${id}`);
            if (!res.ok) throw new Error(`Failed to fetch product with ID: ${id}`);
            return await res.json();
          } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            return null;
          }
        };
        const productsDetails = await Promise.all(productIds.map(fetchProductDetails));
        setRecommendedProducts(productsDetails.filter((product) => product !== null));
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };
    fetchRecommendedProducts();
  }, []);

  // Debounce filter submission to backend and localStorage updates (every 2000ms)
  useEffect(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const filters = {
        colorFilters,
        sizeFilters,
        brandFilters,
        priceSortOption,
        alphabeticalSortOption,
        minPrice,
        maxPrice
      };
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
      sendFilterData(filters);
    }, 2000);
  }, [colorFilters, sizeFilters, brandFilters, minPrice, maxPrice]);

  const sendFilterData = async (filters) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage!");
      return;
    }
    const payload = { userId, filterHistory: filters };
    console.log("Sending filter data:", payload);
    try {
      const response = await fetch("http://localhost:10000/api/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log("Response from backend:", result);
      if (!response.ok) {
        throw new Error(result.error || "Failed to send filter data");
      }
    } catch (error) {
      console.error("Error sending filter data:", error);
    }
  };

  // Set up Fuse.js options for fuzzy search based on the product name
  const fuseOptions = {
    keys: ["product"],
    threshold: 0.4,
    getFn: (obj, path) => normalizeString(obj[path])
  };

  // Memoize the Fuse instance for better performance (rebuild only when products change)
  const fuse = useMemo(() => new Fuse(products, fuseOptions), [products]);

  // Combine fuzzy search with additional client-side filters using useMemo.
  // Filtering now uses "submittedSearchTerm" so results update only when user explicitly searches.
  const filteredProducts = useMemo(() => {
    let result = products;

    if (submittedSearchTerm) {
      const fuseResults = fuse.search(normalizeString(submittedSearchTerm));
      result = fuseResults.map((res) => res.item);
    }

    // Apply additional filters: type, colors, sizes, brands, and price range
    result = result.filter((product) => {
      if (typeFilter !== "all" && product.type !== typeFilter) return false;
      if (colorFilters.length > 0 && !colorFilters.includes(product.filtercolor)) return false;
      if (sizeFilters.length > 0 && !sizeFilters.some(size => product.sizes.includes(size))) return false;
      if (brandFilters.length > 0 && !brandFilters.includes(product.brand)) return false;
      if (product.price < minPrice || product.price > maxPrice) return false;
      return true;
    });

    // Apply sorting options
    result = result.sort((a, b) => {
      if (priceSortOption === "price-asc") return a.price - b.price;
      if (priceSortOption === "price-desc") return b.price - a.price;
      if (alphabeticalSortOption === "A-Z") return a.product.localeCompare(b.product);
      if (alphabeticalSortOption === "Z-A") return b.product.localeCompare(a.product);
      return 0;
    });

    return result;
  }, [
    products,
    submittedSearchTerm,
    typeFilter,
    colorFilters,
    sizeFilters,
    brandFilters,
    priceSortOption,
    alphabeticalSortOption,
    minPrice,
    maxPrice,
    fuse
  ]);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)

      const userId = localStorage.getItem("userId");
      const payload = { userId, blockId };

      // Track page click event
      fetch("http://localhost:10000/api/type-interest/pageClick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(res => res.json())
        .then(data => console.log("Page click tracked successfully:", data))
        .catch(err => console.error("Error tracking page click:", err));
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Function to handle product clicks and send a message to the backend
  const handleProductClick = (productId) => {
    const userId = localStorage.getItem("userId");
    const payload = { userId, blockId };
    // Send product click info to backend
    fetch("http://localhost:10000/api/type-interest/productClick", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => console.log("Product click tracked successfully:", data))
      .catch(error => console.error("Error tracking product click:", error));
    
    // Navigate to product detail page
    navigate(`/product/${productId}`);
  };

  const handleCheckboxChange = (filterState, setFilterState, value) => {
    setFilterState((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleResetFilters = () => {
    setColorFilters([]);
    setSizeFilters([]);
    setBrandFilters([]);
    setPriceSortOption("");
    setAlphabeticalSortOption("");
    setMinPrice(0);
    setMaxPrice(50000);
    setSearchTerm("");
    setSubmittedSearchTerm("");
    setCurrentPage(1);
  };

  // NEW CODE: Function to log search queries to the backend
  const logSearchQuery = async (query) => {
    const userId = localStorage.getItem("userId");
    console.log("Attempting to log search with userId:", userId, "and query:", query);
    if (!userId) {
      console.error("User ID not found in localStorage!");
      return;
    }
    const searchPayload = { userId, query };
    console.log("Search payload being sent:", searchPayload);
    try {
      const response = await fetch("http://localhost:10000/api/searchhistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchPayload)
      });
      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Search query log response:", result);
      if (!response.ok) {
        throw new Error(result.error || "Failed to log search query");
      }
    } catch (error) {
      console.error("Error logging search query:", error);
      console.error("Error details:", error.message);
    }
  };

  // NEW CODE: Handler for when the user triggers a search action
  const handleSearch = () => {
    // Update submittedSearchTerm so filtering happens only upon button click.
    setSubmittedSearchTerm(searchTerm);
    logSearchQuery(searchTerm);
  };

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
    
  return (
    <div className="products-container">
      <div className="filters-container">
        {/* Search Input */}
        <div className="options">
          <label>Search Products: </label>
          <input
            type="text"
            placeholder="Type product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "5px", width: "200px" }}
          />
          {/* NEW CODE: Add search button to trigger submission and logging */}
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Sort by Price */}
        <div className="options">
          <label onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}>
            Sort by Price ▼
          </label>
          {isSortDropdownOpen && (
            <div className="filter-dropdown">
              <label>
                <input
                  type="radio"
                  value="price-asc"
                  checked={priceSortOption === "price-asc"}
                  onChange={() => setPriceSortOption("price-asc")}
                />
                Lowest to Highest
              </label>
              <label>
                <input
                  type="radio"
                  value="price-desc"
                  checked={priceSortOption === "price-desc"}
                  onChange={() => setPriceSortOption("price-desc")}
                />
                Highest to Lowest
              </label>
            </div>
          )}
        </div>

        {/* Alphabetical Sorting */}
        <div className="options">
          <label onClick={() => setIsAlphabeticalDropdownOpen(!isAlphabeticalDropdownOpen)}>
            Sort Alphabetically ▼
          </label>
          {isAlphabeticalDropdownOpen && (
            <div className="filter-dropdown">
              <label>
                <input
                  type="radio"
                  value="A-Z"
                  checked={alphabeticalSortOption === "A-Z"}
                  onChange={() => setAlphabeticalSortOption("A-Z")}
                />
                A-Z
              </label>
              <label>
                <input
                  type="radio"
                  value="Z-A"
                  checked={alphabeticalSortOption === "Z-A"}
                  onChange={() => setAlphabeticalSortOption("Z-A")}
                />
                Z-A
              </label>
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="options">
          <label onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}>
            Price Range ▼
          </label>
          {isPriceDropdownOpen && (
            <div className="filter-dropdown">
              <label>Min Price: Rs. {minPrice}</label>
              <input
                type="range"
                min="0"
                max="50000"
                value={minPrice}
                onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
              />
              <label>Max Price: Rs. {maxPrice}</label>
              <input
                type="range"
                min="0"
                max="50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
              />
            </div>
          )}
        </div>

        {/* Colors Filter */}
        <div className="options">
          <label onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}>
            Colors ▼
          </label>
          {isColorDropdownOpen && (
            <div className="filter-dropdown">
              {uniqueColors.map((color) => (
                <label key={color}>
                  <input
                    type="checkbox"
                    value={color}
                    checked={colorFilters.includes(color)}
                    onChange={() => handleCheckboxChange(colorFilters, setColorFilters, color)}
                  />
                  {color}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Sizes Filter */}
        <div className="options">
          <label onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}>
            Sizes ▼
          </label>
          {isSizeDropdownOpen && (
            <div className="filter-dropdown">
              {uniqueSizes.map((size) => (
                <label key={size}>
                  <input
                    type="checkbox"
                    value={size}
                    checked={sizeFilters.includes(size)}
                    onChange={() => handleCheckboxChange(sizeFilters, setSizeFilters, size)}
                  />
                  {size}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brands Filter */}
        <div className="options">
          <label onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}>
            Brands ▼
          </label>
          {isBrandDropdownOpen && (
            <div className="filter-dropdown">
              {uniqueBrands.map((brand) => (
                <label key={brand}>
                  <input
                    type="checkbox"
                    value={brand}
                    checked={brandFilters.includes(brand)}
                    onChange={() => handleCheckboxChange(brandFilters, setBrandFilters, brand)}
                  />
                  {brand}
                </label>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleResetFilters} className="reset-button">
          Reset
        </button>
      </div>

      {/* Products Grid */}
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
              <h3>{product.product || "Unknown Product"}</h3>
              <p>{product.brand || "Unknown Brand"}</p>
              <p>Rs. {product.price || "N/A"}</p>
              <div className="product-actions">
  {/* 🖤 Wishlist Toggle */}
  <button
    className={`wishlist-button ${wishlistIds.includes(product._id) ? "active" : ""}`}
    onClick={(e) => {
      e.stopPropagation();
      toggleWishlist(product._id);
    }}
    title="Add to Wishlist"
  >
    {wishlistIds.includes(product._id) ? "🖤" : "🤍"}
  </button>

  {/* ⬈ Redirect Link */}
  {product.link && (
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="external-link-button"
      onClick={(e) => e.stopPropagation()}
      title="Visit Product Page"
    >
      ⬈
    </a>
  )}
</div>

            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={currentPage === 1 ? "disabled" : ""}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? "disabled" : ""}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductsDisplay;
