import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductsDisplay.css";

const uniqueColors = [
  "Black", "White", "Grey", "Beige",
  "Red", "Pink", "Orange", "Yellow",
  "Green", "Blue", "Purple",
  "Brown", "Multi-color", "Other"
];
const uniqueBrands = ["LAMA", "Outfitters"];
const uniqueSizes = ["S", "M", "L", "XL", "2XL", "XS", "3XL", "4XL", "30", "32", "34", "36", "38", "40", "28", "33", "24", "26", "S-M", "L-XL", "M-L", "XS-S"];

const TOKEN_KEY = "token";
const FILTERS_STORAGE_KEY = "userFilters";

let debounceTimer;

function ProductsDisplay({ products, currentPage, setCurrentPage }) {
  const productsPerPage = 20;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Load stored filters from localStorage (or use default)
  const storedFilters = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY)) || {
    colorFilters: [],
    sizeFilters: [],
    brandFilters: [],
    minPrice: 0,
    maxPrice: 50000
  };

  const [typeFilter, setTypeFilter] = useState("all");
  const [colorFilters, setColorFilters] = useState([]);
  const [sizeFilters, setSizeFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [priceSortOption, setPriceSortOption] = useState([]);
  const [alphabeticalSortOption, setAlphabeticalSortOption] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);

  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isAlphabeticalDropdownOpen, setIsAlphabeticalDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem(TOKEN_KEY);
  

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        console.log("Fetching recommended product IDs...");
        const inputText = "I am looking for casual dresses in medium size, red color, and cotton material.";

        const response = await fetch("http://127.0.0.1:8000/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input_text: inputText }),
        });

        const productIds = await response.json();
        console.log("Received product IDs:", productIds);

        if (!Array.isArray(productIds) || productIds.length === 0) {
          console.warn("No recommended products received.");
          return;
        }

        console.log("Fetching product details for received IDs...");
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

        const products = await Promise.all(productIds.map(fetchProductDetails));
        setRecommendedProducts(products.filter((product) => product !== null));
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };

    fetchRecommendedProducts();
  }, []);

//   const sendFilterData = async (filters) => {
//     console.log("Sending filter data:", { filterHistory: filters }); // Ensure correct structure

//     try {
//         const response = await fetch("http://localhost:10000/api/filters", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ filterHistory: filters }) // Wrap filters inside 'filterHistory'
//         });

//         const result = await response.json();
//         console.log("Response from backend:", result);

//         if (!response.ok) {
//             throw new Error(result.error || "Failed to send filter data");
//         }
//     } catch (error) {
//         console.error("Error sending filter data:", error);
//     }
// };

  const sendFilterData = async (filters) => {
    const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage

    if (!userId) {
        console.error("User ID not found in localStorage!");
        return;
    }

    const payload = {
        userId, // Include userId
        filterHistory: filters, // Wrap filters inside 'filterHistory'
    };

    console.log("Sending filter data:", payload); // Ensure correct structure

    try {
        const response = await fetch("http://localhost:10000/api/filters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload), // Send userId & filterHistory
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


  // // Save filters to localStorage and send to backend whenever filters change
  // useEffect(() => {
  //   const filters = {
  //     colorFilters,
  //     sizeFilters,
  //     brandFilters,
  //     minPrice,
  //     maxPrice
  //   };
  //   localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  //   sendFilterData(filters);
  // }, [colorFilters, sizeFilters, brandFilters, minPrice, maxPrice]);

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
          sendFilterData(filters); // Send only after a delay
      }, 2000); // 2000ms delay prevents multiple calls
  }, [colorFilters, sizeFilters, brandFilters, minPrice, maxPrice]);

  const filteredProducts = products
    .filter((product) => {
      if (typeFilter !== "all" && product.type !== typeFilter) return false;
      if (colorFilters.length > 0 && !colorFilters.includes(product.filtercolor)) return false;
      if (sizeFilters.length > 0 && !sizeFilters.some(size => product.sizes.includes(size))) return false;
      if (brandFilters.length > 0 && !brandFilters.includes(product.brand)) return false;
      if (product.price < minPrice || product.price > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (priceSortOption === "price-asc") return a.price - b.price;
      if (priceSortOption === "price-desc") return b.price - a.price;
      if (alphabeticalSortOption === "A-Z") return a.product.localeCompare(b.product);
      if (alphabeticalSortOption === "Z-A") return b.product.localeCompare(a.product);
      return 0;
    });

  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (filterState, setFilterState, value) => {
    setFilterState((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleResetFilters = () => {
    setColorFilters([]);
    setSizeFilters([]);
    setBrandFilters([]);
    setPriceSortOption([]);
    setAlphabeticalSortOption([]);
    setMinPrice(0);
    setMaxPrice(50000);
    console.log("Hello")
  
    // localStorage.removeItem(FILTERS_STORAGE_KEY);

    setCurrentPage(1); // Reset pagination to first page
};
  
  // sendFilterData(defaultFilters);
  return (
    <div className="products-container">
      <div className="filters-container">

        {/* Sort by Price */}
        <div className="options">
          <label onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}>Sort by Price ▼</label>
          {isSortDropdownOpen && (
            <div className="filter-dropdown">
              <label>
                <input type="radio" value="price-asc" checked={priceSortOption === "price-asc"} onChange={() => setPriceSortOption("price-asc")} />
                Lowest to Highest
              </label>
              <label>
                <input type="radio" value="price-desc" checked={priceSortOption === "price-desc"} onChange={() => setPriceSortOption("price-desc")} />
                Highest to Lowest
              </label>
            </div>
          )}
        </div>

        {/* Sort Alphabetically */}
        <div className="options">
          <label onClick={() => setIsAlphabeticalDropdownOpen(!isAlphabeticalDropdownOpen)}>Sort ▼</label>
          {isAlphabeticalDropdownOpen && (
            <div className="filter-dropdown">
              <label>
                <input type="radio" value="A-Z" checked={alphabeticalSortOption === "A-Z"} onChange={() => setAlphabeticalSortOption("A-Z")} />
                A-Z
              </label>
              <label>
                <input type="radio" value="Z-A" checked={alphabeticalSortOption === "Z-A"} onChange={() => setAlphabeticalSortOption("Z-A")} />
                Z-A
              </label>
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="options">
          <label onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}>Price Range ▼</label>
          {isPriceDropdownOpen && (
            <div className="filter-dropdown">
              <label>Min Price: Rs. {minPrice}</label>
              <input type="range" min="0" max="50000" value={minPrice} onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))} />
              <label>Max Price: Rs. {maxPrice}</label>
              <input type="range" min="0" max="50000" value={maxPrice} onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))} />
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="options">
          <label onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}>Colors ▼</label>
          {isColorDropdownOpen && (
            <div className="filter-dropdown">
              {uniqueColors.map((color) => (
                <label key={color}>
                  <input type="checkbox" value={color} checked={colorFilters.includes(color)} onChange={() => handleCheckboxChange(colorFilters, setColorFilters, color)} />
                  {color}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="options">
          <label onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}>Sizes ▼</label>
          {isSizeDropdownOpen && (
            <div className="filter-dropdown">
              {uniqueSizes.map((size) => (
                <label key={size}>
                  <input type="checkbox" value={size} checked={sizeFilters.includes(size)} onChange={() => handleCheckboxChange(sizeFilters, setSizeFilters, size)} />
                  {size}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="options">
          <label onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}>Brands ▼</label>
          {isBrandDropdownOpen && (
            <div className="filter-dropdown">
              {uniqueBrands.map((brand) => (
                <label key={brand}>
                  <input type="checkbox" value={brand} checked={brandFilters.includes(brand)} onChange={() => handleCheckboxChange(brandFilters, setBrandFilters, brand)} />
                  {brand}
                </label>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleResetFilters} className="reset-button">Reset</button>
      </div>

      <div className="products-grid">
        {currentProducts.map((product) => (
          <div key={product._id} className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
            <img src={product.images?.[0] || "/default-image.jpg"} alt={product.product || "Product"} className="product-image" />
            <div className="product-info">
              <h3>{product.product || "Unknown Product"}</h3>
              <p>{product.brand || "Unknown Brand"}</p>
              <p>Rs. {product.price || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className={currentPage === 1 ? "disabled" : ""}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className={currentPage === totalPages ? "disabled" : ""}>
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductsDisplay;