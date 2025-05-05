import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "../Header/Header.jsx";
import ProductsDisplay from "../ProductDisplay/ProductsDisplay.jsx";
import ChatbotIcon from "../ChatBot/ChatbotIcon.jsx";
import ChatbotI from "../ChatBot/ChatbotI.jsx";
import "../AuthPages/LandingPageC.jsx";

function All() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [colorFilters, setColorFilters] = useState([]);
  const [sizeFilters, setSizeFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [priceSortOption, setPriceSortOption] = useState("");
  const [alphabeticalSortOption, setAlphabeticalSortOption] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);

  const [currentBlockId, setCurrentBlockId] = useState(() => {
    return sessionStorage.getItem("currentBlockId") || uuidv4();
  });

  useEffect(() => {
    const cached = localStorage.getItem("allProducts");
    if (cached) {
      setProducts(JSON.parse(cached));
    }
    else {
      // Step 1: Fetch first 100 for fast display
      async function fetchInitialProducts() {
        try {
          const response = await fetch("https://sproj-p14-code.onrender.com/api/fetchproducts?limit=100");
          const data = await response.json();
          setProducts(data);
          localStorage.setItem("allProducts", JSON.stringify(data));
        } catch (error) {
          console.error("Error fetching initial 100 products:", error);
        }
      }

      // Step 2: Fetch full list in background
      async function fetchAllProducts() {
        try {
          const response = await fetch("https://sproj-p14-code.onrender.com/api/fetchproducts");a
          const data = await response.json();
          setProducts(data); // Optional: update state again
          localStorage.setItem("allProducts", JSON.stringify(data));
          console.log("Full product list cached.");
        } catch (error) {
          console.error("Error fetching all products:", error);
        }
      }

      fetchInitialProducts().then(fetchAllProducts);
    }
  
    async function fetchProducts() {
      try {
        const response = await fetch("https://sproj-p14-code.onrender.com/api/fetchproducts");
        const data = await response.json();
        setProducts(data);
        localStorage.setItem("allProducts", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (genderFilter !== "all" && product.gender !== genderFilter) return false;
    if (categoryFilter !== "all" && product.type !== categoryFilter) return false;
    if (searchQuery && !product.product.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setGenderFilter={setGenderFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <ProductsDisplay
        products={filteredProducts}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        colorFilters={colorFilters} setColorFilters={setColorFilters}
        sizeFilters={sizeFilters} setSizeFilters={setSizeFilters}
        brandFilters={brandFilters} setBrandFilters={setBrandFilters}
        priceSortOption={priceSortOption} setPriceSortOption={setPriceSortOption}
        alphabeticalSortOption={alphabeticalSortOption} setAlphabeticalSortOption={setAlphabeticalSortOption}
        minPrice={minPrice} setMinPrice={setMinPrice}
        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        blockId={currentBlockId}
      />

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
}

export default All;
