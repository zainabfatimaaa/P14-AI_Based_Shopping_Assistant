import React, { useState, useEffect } from "react";
import Header from "../Header/Header.jsx";
import ProductsDisplay from "../ProductDisplay/ProductsDisplay.jsx";
import ChatbotIcon from "../ChatBot/ChatbotIcon.jsx";
import ChatbotI from "../ChatBot/ChatbotI.jsx";
import "./LandingPage.css";

function LandingPageC() {
  const [products, setProducts] = useState([]); // Store all products
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://sproj-p14-code.onrender.com/api/fetchproducts");
        const data = await response.json();
        setProducts(data); // Save fetched products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  // Filter products based on gender and category
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
        currentPage={currentPage} // Pass the current page
        setCurrentPage={setCurrentPage} // Function to change the page
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

export default LandingPageC;