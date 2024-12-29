import React, { useState, useEffect } from "react";
import Header from "../Header/Header.jsx";
import ProductsDisplay from "../ProductDisplay/ProductsDisplay.jsx";
import ChatbotIcon from "../ChatBot/ChatbotIcon.jsx";
import ChatbotI from "../ChatBot/ChatbotI.jsx"
import "./LandingPage.css";

function LandingPageC() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering products
  const [genderFilter, setGenderFilter] = useState("all"); // Gender filter
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // State for chatbot visibility

  // Fetch products from the backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://sproj-p14-code.onrender.com/api/fetchproducts");
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  // Filter products based on search query and gender
  const filteredProducts = products.filter((product) => {
    if (genderFilter !== "all" && product.gender !== genderFilter) return false;
    if (
      searchQuery &&
      !product.product.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setGenderFilter={setGenderFilter} // Pass gender filter state changer
      />
      <ProductsDisplay products={filteredProducts} /> {/* Pass filtered products */}

      <ChatbotIcon onClick={() => setIsChatbotOpen(!isChatbotOpen)} /> {/* Toggle chatbot */}

      {isChatbotOpen && (
        <div className="chatbot-window-container">
          <ChatbotI />
          <button
            className="close-chatbot-btn"
            onClick={() => setIsChatbotOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}

export default LandingPageC;
