import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductsDisplay.css";

const uniqueColors = ["Grey", "White", "Red", "Green", "Brown", "Black", "Blue", "Beige", "Orange", "Pink", "Yellow", "Purple", "Multi-color", "Other"];
const uniqueSizes = ["S", "M", "L", "XL", "2XL", "XS", "3XL", "4XL", "30", "32", "34", "36", "38", "40", "28", "33", "24", "26", "S-M", "L-XL", "M-L", "XS-S"];
const uniqueTypes = [
  "T-Shirt", "Hoodies & Sweatshirts", "Sweaters & Cardigans", "Jackets & Coats", "Blazers",
  "Polo", "Shirts", "Trousers", "Jeans", "Shorts", "Fur & Fleece", "Bodysuits", "Dresses & Skirts",
  "Camisole & Bandeaus", "Tops & Blouses", "TrueBody", "Activewear", "Co-ords"
];

const TOKEN_KEY = "token";

function ProductsDisplay({ products, currentPage, setCurrentPage }) {
  const productsPerPage = 20;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [priceSortOption, setPriceSortOption] = useState("none");
  const [storeFilter, setStoreFilter] = useState("all");
  const navigate = useNavigate();
  const token = localStorage.getItem(TOKEN_KEY);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
        try {
            console.log("Fetching recommended product IDs...");

            // Define input text
            const inputText = "I am looking for casual dresses in medium size, red color, and cotton material.";

            // First API Call: Get Recommended Product IDs with input text
            const response = await fetch("http://127.0.0.1:8000/recommendations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input_text: inputText }), // Send input text as part of the request
            });

            const productIds = await response.json();

            console.log("Received product IDs:", productIds);

            // Validate response
            if (!Array.isArray(productIds) || productIds.length === 0) {
                console.warn("No recommended products received.");
                return;
            }

            // Second API Call: Fetch Products Data in Parallel
            console.log("Fetching product details for received IDs...");

            const fetchProductDetails = async (id) => {
                try {
                    const res = await fetch(`https://sproj-p14-code.onrender.com/api/fetchproducts/${id}`);
                    if (!res.ok) throw new Error(`Failed to fetch product with ID: ${id}`);
                    const product = await res.json();
                    console.log(`Fetched product ${id}:`, product);
                    return product;
                } catch (error) {
                    console.error(`Error fetching product ${id}:`, error);
                    return null; // Return null so we can filter it out later
                }
            };

            // Fetch all products in parallel using Promise.all
            const products = await Promise.all(productIds.map(fetchProductDetails));

            // Filter out any null values (failed fetches)
            const validProducts = products.filter((product) => product !== null);

            console.log("Final recommended products list:", validProducts);

            // Update state with fetched products
            setRecommendedProducts(validProducts);
        } catch (error) {
            console.error("Error fetching recommended products:", error);
        }
    };

    fetchRecommendedProducts();
}, []);

  const filteredProducts = products
    .filter((product) => {
      if (typeFilter !== "all" && product.type !== typeFilter) return false;
      if (colorFilter !== "all" && product.filtercolor !== colorFilter) return false;
      if (sizeFilter !== "all" && !product.sizes.includes(sizeFilter)) return false;
      if (storeFilter !== "all" && product.brand.toLowerCase() !== storeFilter.toLowerCase()) return false;
      return true;
    })
    .sort((a, b) => {
      if (priceSortOption === "price-asc") return a.price - b.price;
      if (priceSortOption === "price-desc") return b.price - a.price;
      return 0;
    });

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleResetFilters = () => {
    setTypeFilter("all");
    setColorFilter("all");
    setSizeFilter("all");
    setPriceSortOption("none");
    setStoreFilter("all");
  };

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="products-container">
      <div className="filters-container">
        <div className="options">
          <select id="type-filter" onChange={(e) => setTypeFilter(e.target.value)} value={typeFilter}>
            <option value="all">Category</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="options">
          <select id="price-filter" onChange={(e) => setPriceSortOption(e.target.value)} value={priceSortOption}>
            <option value="none">Price</option>
            <option value="price-asc">Lowest to Highest</option>
            <option value="price-desc">Highest to Lowest</option>
          </select>
        </div>
        <div className="options">
          <select id="color-filter" onChange={(e) => setColorFilter(e.target.value)} value={colorFilter}>
            <option value="all">Color</option>
            {uniqueColors.map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
        <button onClick={handleResetFilters} className="reset-button">Reset</button>
      </div>

      <div className="recommended-products-container">
        <h2>Recommended for You</h2>
        <div className="recommended-products-scroll">
          {recommendedProducts.map((product) => (
            <div key={product._id} className="product-card" onClick={() => handleCardClick(product._id)}>
              <img src={product.images?.[0] || "/default-image.jpg"} alt={product.product || "Product"} className="product-image" />
              <div className="product-info">
                <h3 className="product-name">{product.product || "Unknown Product"}</h3>
                <p className="product-brand">{product.brand || "Unknown Brand"}</p>
                <p className="product-price">Rs. {product.price || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {currentProducts.map((product) => (
          <div key={product._id} className="product-card" onClick={() => handleCardClick(product._id)}>
            <img src={product.images?.[0] || "/default-image.jpg"} alt={product.product || "Product"} className="product-image" />
            <div className="product-info">
              <h3 className="product-name">{product.product || "Unknown Product"}</h3>
              <p className="product-brand">{product.brand || "Unknown Brand"}</p>
              <p className="product-price">Rs. {product.price || "N/A"}</p>
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

export default ProductsDisplay;
