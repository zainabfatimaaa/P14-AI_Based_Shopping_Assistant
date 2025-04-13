import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getCategoryNameFromSlug } from "../../utils/categorySlugUtils";
import Header from "../Header/Header.jsx";
import ProductsDisplay from "../ProductDisplay/ProductsDisplay.jsx";
import HomePage from "../ProductDisplay/Homepage.jsx";
import ChatbotIcon from "../ChatBot/ChatbotIcon.jsx";
import ChatbotI from "../ChatBot/ChatbotI.jsx";
import "./LandingPage.css";

function LandingPageC() {
  const [products, setProducts] = useState([]); // Store all products
  const [recommendedProducts, setRecommendedProducts] = useState([]); // Store recommended products
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const { genderCategory } = useParams();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination

  const [colorFilters, setColorFilters] = useState([]);
  const [sizeFilters, setSizeFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [priceSortOption, setPriceSortOption] = useState("");
  const [alphabeticalSortOption, setAlphabeticalSortOption] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);

  const [currentBlockId, setCurrentBlockId] = useState(() => {
    return sessionStorage.getItem("currentBlockId") || null;
  });
  

  // const previousGenderCategoryRef = useRef(localStorage.getItem("previousGenderCategory") || null);
  const previousGenderCategoryRef = useRef(sessionStorage.getItem("previousGenderCategory") || null);


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

  // Fetch recommended products from the backend or localStorage when the page is mounted
  useEffect(() => {
    // localStorage.removeItem("recommendedProducts");
    // Check if recommended products are already in localStorage
    const storedProducts = JSON.parse(localStorage.getItem("recommendedProducts"));
    const userId = localStorage.getItem("userId");
  
    if (storedProducts) {
      setRecommendedProducts(storedProducts); // Set products from localStorage if available
    } else {
      async function fetchRecommendedProducts() {
        try {
          const response = await fetch("http://localhost:10000/api/recommended-products", {
            method: "POST", // Use POST if you are sending data
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }), // Send userId in the request body
          });
          const data = await response.json();
  
          // Save recommended products to localStorage
          localStorage.setItem("recommendedProducts", JSON.stringify(data));
  
          // Set products state with the fetched data
          setRecommendedProducts(data);
        } catch (error) {
          console.error("Error fetching recommended products:", error);
        }
      }
  
      fetchRecommendedProducts();
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const lastUpdated = localStorage.getItem("recommendationLastUpdated");
    const now = Date.now();
  
    // Only refresh if it's been more than 15 minutes or never fetched
    if (!lastUpdated || now - parseInt(lastUpdated) > 15 * 60 * 1000) {
      fetch("http://localhost:10000/api/recommended-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
        .then(res => res.json())
        .then(data => {
          localStorage.setItem("recommendedProducts", JSON.stringify(data));
          localStorage.setItem("recommendationLastUpdated", now.toString());
          console.log("Recommendations refreshed in background.");
        })
        .catch(err => {
          console.error("Failed to refresh recommendations:", err);
        });
    }
  }, []);
  

  useEffect(() => {
    if (genderCategory) {
      const [gender, ...categoryParts] = genderCategory.split('-');
      const genderCapitalized = gender.charAt(0).toUpperCase() + gender.slice(1);
      const categorySlug = categoryParts.join('-');
      const originalCategoryName = getCategoryNameFromSlug(categorySlug);
  
      // Always update filters
      setGenderFilter(genderCapitalized);
      setCategoryFilter(originalCategoryName);
  
      // Only send analytics if genderCategory actually changed
      if (genderCategory !== previousGenderCategoryRef.current) {
        const blockId = uuidv4();
        setCurrentBlockId(blockId);
        sessionStorage.setItem("currentBlockId", blockId);
        const userId = localStorage.getItem("userId");
  
        const payload = {
          userId,
          blockId,
          gender: genderCapitalized,
          category: originalCategoryName
        };
  
        fetch("http://localhost:10000/api/type-interest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Data sent successfully:', data);
          })
          .catch(error => {
            console.error('Error sending data:', error);
          });
  
        // Save the latest genderCategory
        // previousGenderCategoryRef.current = genderCategory;
        sessionStorage.setItem("previousGenderCategory", genderCategory);
  
        // Reset filters
        setColorFilters([]);
        setSizeFilters([]);
        setBrandFilters([]);
        setPriceSortOption("");
        setAlphabeticalSortOption("");
        setMinPrice(0);
        setMaxPrice(50000);
        setSearchQuery("");
        setCurrentPage(1);
      }
    } else {
      setGenderFilter("all");
      setCategoryFilter("all");
    }
  }, [genderCategory]);

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
      {genderCategory ? (
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
      ) : (
        <HomePage  
          product={products} 
          recommendedProducts={recommendedProducts.length > 0 ? recommendedProducts : products}
        />
      )}
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
