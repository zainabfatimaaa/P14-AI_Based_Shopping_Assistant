// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import Fuse from "fuse.js";
// import "./ProductsDisplay.css";
// import ProductFilters from "../Filters/ProductFilters";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
// import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import { faFilter } from '@fortawesome/free-solid-svg-icons';
// import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

// const TOKEN_KEY = "token";
// const FILTERS_STORAGE_KEY = "userFilters";
// let debounceTimer;

// const normalizeString = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, "");

// function ProductsDisplay({
//   products, currentPage, setCurrentPage,
//   colorFilters, setColorFilters,
//   sizeFilters, setSizeFilters,
//   brandFilters, setBrandFilters,
//   priceSortOption, setPriceSortOption,
//   alphabeticalSortOption, setAlphabeticalSortOption,
//   minPrice, setMinPrice,
//   maxPrice, setMaxPrice,
//   blockId
// }) {
//   const productsPerPage = 20;
//   const totalPages = Math.ceil(products.length / productsPerPage);
//   const navigate = useNavigate();
//   const token = localStorage.getItem(TOKEN_KEY);

//   const [recommendedProducts, setRecommendedProducts] = useState([]);
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
//   const [wishlistIds, setWishlistIds] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [skip, setSkip] = useState(0);

//   const toggleFilters = () => {
//     setShowFilters(prev => !prev);
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [submittedSearchTerm, setCurrentPage]);

//   // Fetch initial products and on "Load More"
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch(`http://localhost:10000/api/products?skip=${skip}&limit=${productsPerPage}`);
//         if (!response.ok) throw new Error("Failed to fetch products");
//         const newProducts = await response.json();
//         if (newProducts.length < productsPerPage) {
//           setHasMore(false); // No more products to fetch
//         }
//         setProducts((prev) => [...prev, ...newProducts]); // Append new products
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, [skip]);

//   // Fetch recommended products (unchanged)
//   useEffect(() => {
//     const fetchRecommendedProducts = async () => {
//       try {
//         const inputText = "I am looking for casual dresses in medium size, red color, and cotton material.";
//         const response = await fetch("http://127.0.0.1:8000/recommendations", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ input_text: inputText }),
//         });
//         const productIds = await response.json();
//         if (!Array.isArray(productIds) || productIds.length === 0) return;
//         const fetchProductDetails = async (id) => {
//           try {
//             const res = await fetch(`https://sproj-p14-code.onrender.com/api/fetchproducts/${id}`);
//             if (!res.ok) throw new Error(`Failed to fetch product with ID: ${id}`);
//             return await res.json();
//           } catch (error) {
//             return null;
//           }
//         };
//         const productsDetails = await Promise.all(productIds.map(fetchProductDetails));
//         setRecommendedProducts(productsDetails.filter((product) => product !== null));
//       } catch (error) {
//         console.error("Error fetching recommended products:", error);
//       }
//     };
//     fetchRecommendedProducts();
//   }, []);

//   useEffect(() => {
//     clearTimeout(debounceTimer);
//     debounceTimer = setTimeout(() => {
//       const filters = {
//         colorFilters,
//         sizeFilters,
//         brandFilters,
//         priceSortOption,
//         alphabeticalSortOption,
//         minPrice,
//         maxPrice
//       };
//       localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
//       sendFilterData(filters);
//     }, 2000);
//   }, [colorFilters, sizeFilters, brandFilters, minPrice, maxPrice]);

//   const sendFilterData = async (filters) => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;
//     const payload = { userId, filterHistory: filters };
//     try {
//       const response = await fetch("http://localhost:10000/api/filters", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//       if (!response.ok) {
//         const result = await response.json();
//         throw new Error(result.error || "Failed to send filter data");
//       }
//     } catch (error) {
//       console.error("Error sending filter data:", error);
//     }
//   };

//   const fuseOptions = {
//     keys: ["product"],
//     threshold: 0.4,
//     getFn: (obj, path) => normalizeString(obj[path])
//   };
//   const fuse = useMemo(() => new Fuse(products, fuseOptions), [products]);

//   const filteredProducts = useMemo(() => {
//     let result = products;

//     if (submittedSearchTerm) {
//       const fuseResults = fuse.search(normalizeString(submittedSearchTerm));
//       result = fuseResults.map((res) => res.item);
//     }

//     result = result.filter((product) => {
//       if (typeFilter !== "all" && product.type !== typeFilter) return false;
//       if (colorFilters.length > 0 && !colorFilters.includes(product.filtercolor)) return false;
//       if (sizeFilters.length > 0 && !sizeFilters.some(size => product.sizes.includes(size))) return false;
//       if (brandFilters.length > 0 && !brandFilters.includes(product.brand)) return false;
//       if (product.price < minPrice || product.price > maxPrice) return false;
//       return true;
//     });

//     result = result.sort((a, b) => {
//       if (priceSortOption === "price-asc") return a.price - b.price;
//       if (priceSortOption === "price-desc") return b.price - a.price;
//       if (alphabeticalSortOption === "A-Z") return a.product.localeCompare(b.product);
//       if (alphabeticalSortOption === "Z-A") return b.product.localeCompare(a.product);
//       return 0;
//     });

//     return result;
//   }, [products, submittedSearchTerm, typeFilter, colorFilters, sizeFilters, brandFilters, priceSortOption, alphabeticalSortOption, minPrice, maxPrice, fuse]);

//   const currentProducts = filteredProducts.slice(
//     (currentPage - 1) * productsPerPage,
//     currentPage * productsPerPage
//   );

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//       const userId = localStorage.getItem("userId");
//       const payload = { userId, blockId };
//       fetch("http://localhost:10000/api/type-interest/pageClick", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleLoadMore = () => {
//     setSkip((prev) => prev + productsPerPage); // Fetch the next set of products
//     const userId = localStorage.getItem("userId");
//     const payload = { userId, blockId };
//     fetch("http://localhost:10000/api/type-interest/pageClick", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//   const handleProductClick = (productId) => {
//     const userId = localStorage.getItem("userId");
//     const payload = { userId, blockId };
//     fetch("http://localhost:10000/api/type-interest/productClick", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     navigate(`/product/${productId}`);
//   };

//   const logSearchQuery = async (query) => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;
//     const searchPayload = { userId, query };
//     try {
//       await fetch("http://localhost:10000/api/searchhistory", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(searchPayload)
//       });
//     } catch (error) {
//       console.error("Error logging search query:", error);
//     }
//   };

//   const handleSearch = () => {
//     setSubmittedSearchTerm(searchTerm);
//     logSearchQuery(searchTerm);
//   };

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch("http://localhost:10000/api/wishlist", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         setWishlistIds(data.wishlist.map((item) => item._id));
//       } catch (err) {
//         console.error("Error fetching wishlist:", err);
//       }
//     };
//     fetchWishlist();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = () => {
//       if (showFilters) setShowFilters(false);
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [showFilters]);

//   const toggleWishlist = async (productId) => {
//     const token = localStorage.getItem("token");
//     const isInWishlist = wishlistIds.includes(productId);
//     const url = isInWishlist
//       ? `http://localhost:10000/api/wishlist/remove/${productId}`
//       : `http://localhost:10000/api/wishlist/add/${productId}`;
//     const method = isInWishlist ? "DELETE" : "POST";
//     try {
//       const response = await fetch(url, {
//         method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.ok) {
//         setWishlistIds((prev) =>
//           isInWishlist
//             ? prev.filter((id) => id !== productId)
//             : [...prev, productId]
//         );
//       }
//     } catch (err) {
//       console.error("Error toggling wishlist:", err);
//     }
//   };

//   return (
//     <div className="products-container">
//       <div className="top-bar">
//         <div className="search-filter-container">
//           <div className="search-bar">
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button onClick={handleSearch}>
//               <FontAwesomeIcon icon={faSearch} />
//             </button>
//           </div>
//           <button className="filter-icon" onClick={toggleFilters}>
//             <FontAwesomeIcon icon={faFilter} />
//           </button>
//         </div>
//       </div>

//       {showFilters && (
//         <ProductFilters
//           colorFilters={colorFilters}
//           setColorFilters={setColorFilters}
//           sizeFilters={sizeFilters}
//           setSizeFilters={setSizeFilters}
//           brandFilters={brandFilters}
//           setBrandFilters={setBrandFilters}
//           priceSortOption={priceSortOption}
//           setPriceSortOption={setPriceSortOption}
//           alphabeticalSortOption={alphabeticalSortOption}
//           setAlphabeticalSortOption={setAlphabeticalSortOption}
//           minPrice={minPrice}
//           setMinPrice={setMinPrice}
//           maxPrice={maxPrice}
//           setMaxPrice={setMaxPrice}
//         />
//       )}

//       <div className="products-grid">
//         {filteredProducts.map((product) => (
//           <div
//             key={product._id}
//             className="product-card"
//             onClick={() => handleProductClick(product._id)}
//           >
//             <img
//               src={product.images?.[0] || "/default-image.jpg"}
//               alt={product.product || "Product"}
//               className="product-image"
//             />
//             <div className="product-info">
//               <h3>{product.product}</h3>
//               <p>{product.brand}</p>
//               <p>Rs. {product.price}</p>
//               <div className="product-actions">
//                 <div className="icon-container">
//                   <button
//                     className={`wishlist-button ${wishlistIds.includes(product._id) ? 'active' : ''}`}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleWishlist(product._id);
//                     }}
//                     title="Add to Wishlist"
//                   >
//                     <FontAwesomeIcon icon={wishlistIds.includes(product._id) ? solidHeart : regularHeart} />
//                   </button>
//                   {product.link && (
//                     <a
//                       href={product.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="external-link-button"
//                       onClick={(e) => e.stopPropagation()}
//                       title="Visit Product Page"
//                     >
//                       <FontAwesomeIcon icon={faExternalLinkAlt} />
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {hasMore && (
//         <div className="load-more">
//           <button onClick={handleLoadMore}>Load More</button>
//         </div>
//       )}
//     </div>
//   );
// }}

// export default ProductsDisplay;



// // import React, { useState, useEffect, useMemo } from "react";
// // import { useNavigate } from "react-router-dom";
// // import Fuse from "fuse.js";
// // import "./ProductsDisplay.css";
// // import ProductFilters from "../Filters/ProductFilters";
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
// // import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
// // import { faSearch } from '@fortawesome/free-solid-svg-icons';
// // import { faFilter } from '@fortawesome/free-solid-svg-icons';
// // import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

// // const TOKEN_KEY = "token";
// // const FILTERS_STORAGE_KEY = "userFilters";
// // let debounceTimer;

// // const normalizeString = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, "");

// // function ProductsDisplay({
// //   colorFilters, setColorFilters,
// //   sizeFilters, setSizeFilters,
// //   brandFilters, setBrandFilters,
// //   priceSortOption, setPriceSortOption,
// //   alphabeticalSortOption, setAlphabeticalSortOption,
// //   minPrice, setMinPrice,
// //   maxPrice, setMaxPrice,
// //   blockId
// // }) {
// //   const productsPerPage = 30; // Changed to 30 for lazy loading
// //   const navigate = useNavigate();
// //   const token = localStorage.getItem(TOKEN_KEY);

// //   const [products, setProducts] = useState([]); // Manage products internally
// //   const [skip, setSkip] = useState(0);
// //   const [hasMore, setHasMore] = useState(true);
// //   const [recommendedProducts, setRecommendedProducts] = useState([]);
// //   const [typeFilter, setTypeFilter] = useState("all");
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
// //   const [wishlistIds, setWishlistIds] = useState([]);
// //   const [showFilters, setShowFilters] = useState(false);

// //   const toggleFilters = () => {
// //     setShowFilters(prev => !prev);
// //   };

// //   // Fetch products for lazy loading
// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       try {
// //         const response = await fetch(`http://localhost:10000/api/fetchproducts?skip=${skip}&limit=${productsPerPage}`);
// //         if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
// //         const newProducts = await response.json();
// //         if (newProducts.length < productsPerPage) {
// //           setHasMore(false);
// //         }
// //         setProducts((prev) => [...prev, ...newProducts]);
// //       } catch (error) {
// //         console.error("Error fetching products:", error);
// //       }
// //     };
// //     fetchProducts();
// //   }, [skip]);

// //   // Reset products when filters or search change
// //   useEffect(() => {
// //     setProducts([]);
// //     setSkip(0);
// //     setHasMore(true);
// //   }, [submittedSearchTerm, colorFilters, sizeFilters, brandFilters, minPrice, maxPrice, typeFilter]);

// //   // Fetch recommended products (unchanged)
// //   useEffect(() => {
// //     const fetchRecommendedProducts = async () => {
// //       try {
// //         const inputText = "I am looking for casual dresses in medium size, red color, and cotton material.";
// //         const response = await fetch("http://127.0.0.1:8000/recommendations", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ input_text: inputText }),
// //         });
// //         const productIds = await response.json();
// //         if (!Array.isArray(productIds) || productIds.length === 0) return;
// //         const fetchProductDetails = async (id) => {
// //           try {
// //             const res = await fetch(`https://sproj-p14-code.onrender.com/api/fetchproducts/${id}`);
// //             if (!res.ok) throw new Error(`Failed to fetch product with ID: ${id}`);
// //             return await res.json();
// //           } catch (error) {
// //             return null;
// //           }
// //         };
// //         const productsDetails = await Promise.all(productIds.map(fetchProductDetails));
// //         setRecommendedProducts(productsDetails.filter((product) => product !== null));
// //       } catch (error) {
// //         console.error("Error fetching recommended products:", error);
// //       }
// //     };
// //     fetchRecommendedProducts();
// //   }, []);

// //   // Save filters to localStorage (unchanged)
// //   useEffect(() => {
// //     clearTimeout(debounceTimer);
// //     debounceTimer = setTimeout(() => {
// //       const filters = {
// //         colorFilters,
// //         sizeFilters,
// //         brandFilters,
// //         priceSortOption,
// //         alphabeticalSortOption,
// //         minPrice,
// //         maxPrice
// //       };
// //       localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
// //       sendFilterData(filters);
// //     }, 2000);
// //   }, [colorFilters, sizeFilters, brandFilters, minPrice, maxPrice]);

// //   const sendFilterData = async (filters) => {
// //     const userId = localStorage.getItem("userId");
// //     if (!userId) return;
// //     const payload = { userId, filterHistory: filters };
// //     try {
// //       const response = await fetch("http://localhost:10000/api/filters", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload)
// //       });
// //       if (!response.ok) {
// //         const result = await response.json();
// //         throw new Error(result.error || "Failed to send filter data");
// //       }
// //     } catch (error) {
// //       console.error("Error sending filter data:", error);
// //     }
// //   };

// //   const fuseOptions = {
// //     keys: ["product"],
// //     threshold: 0.4,
// //     getFn: (obj, path) => normalizeString(obj[path])
// //   };
// //   const fuse = useMemo(() => new Fuse(products, fuseOptions), [products]);

// //   const filteredProducts = useMemo(() => {
// //     let result = products;

// //     if (submittedSearchTerm) {
// //       const fuseResults = fuse.search(normalizeString(submittedSearchTerm));
// //       result = fuseResults.map((res) => res.item);
// //     }

// //     result = result.filter((product) => {
// //       if (typeFilter !== "all" && product.type !== typeFilter) return false;
// //       if (colorFilters.length > 0 && !colorFilters.includes(product.filtercolor)) return false;
// //       if (sizeFilters.length > 0 && !sizeFilters.some(size => product.sizes.includes(size))) return false;
// //       if (brandFilters.length > 0 && !brandFilters.includes(product.brand)) return false;
// //       if (product.price < minPrice || product.price > maxPrice) return false;
// //       return true;
// //     });

// //     result = result.sort((a, b) => {
// //       if (priceSortOption === "price-asc") return a.price - b.price;
// //       if (priceSortOption === "price-desc") return b.price - a.price;
// //       if (alphabeticalSortOption === "A-Z") return a.product.localeCompare(b.product);
// //       if (alphabeticalSortOption === "Z-A") return b.product.localeCompare(a.product);
// //       return 0;
// //     });

// //     return result;
// //   }, [products, submittedSearchTerm, typeFilter, colorFilters, sizeFilters, brandFilters, priceSortOption, alphabeticalSortOption, minPrice, maxPrice, fuse]);

// //   const handleLoadMore = () => {
// //     setSkip((prev) => prev + productsPerPage);
// //     const userId = localStorage.getItem("userId");
// //     const payload = { userId, blockId };
// //     fetch("http://localhost:10000/api/type-interest/pageClick", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(payload),
// //     });
// //   };

// //   const handleProductClick = (productId) => {
// //     const userId = localStorage.getItem("userId");
// //     const payload = { userId, blockId };
// //     fetch("http://localhost:10000/api/type-interest/productClick", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(payload),
// //     });
// //     navigate(`/product/${productId}`);
// //   };

// //   const logSearchQuery = async (query) => {
// //     const userId = localStorage.getItem("userId");
// //     if (!userId) return;
// //     const searchPayload = { userId, query };
// //     try {
// //       await fetch("http://localhost:10000/api/searchhistory", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(searchPayload)
// //       });
// //     } catch (error) {
// //       console.error("Error logging search query:", error);
// //     }
// //   };

// //   const handleSearch = () => {
// //     setSubmittedSearchTerm(searchTerm);
// //     logSearchQuery(searchTerm);
// //   };

// //   useEffect(() => {
// //     const fetchWishlist = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         const response = await fetch("http://localhost:10000/api/wishlist", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         const data = await response.json();
// //         setWishlistIds(data.wishlist.map((item) => item._id));
// //       } catch (err) {
// //         console.error("Error fetching wishlist:", err);
// //       }
// //     };
// //     fetchWishlist();
// //   }, []);

// //   useEffect(() => {
// //     const handleClickOutside = () => {
// //       if (showFilters) setShowFilters(false);
// //     };
// //     document.addEventListener("click", handleClickOutside);
// //     return () => document.removeEventListener("click", handleClickOutside);
// //   }, [showFilters]);

// //   const toggleWishlist = async (productId) => {
// //     const token = localStorage.getItem("token");
// //     const isInWishlist = wishlistIds.includes(productId);
// //     const url = isInWishlist
// //       ? `http://localhost:10000/api/wishlist/remove/${productId}`
// //       : `http://localhost:10000/api/wishlist/add/${productId}`;
// //     const method = isInWishlist ? "DELETE" : "POST";
// //     try {
// //       const response = await fetch(url, {
// //         method,
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //           "Content-Type": "application/json",
// //         },
// //       });
// //       if (response.ok) {
// //         setWishlistIds((prev) =>
// //           isInWishlist
// //             ? prev.filter((id) => id !== productId)
// //             : [...prev, productId]
// //         );
// //       }
// //     } catch (err) {
// //       console.error("Error toggling wishlist:", err);
// //     }
// //   };

// //   return (
// //     <div className="products-container">
// //       <div className="top-bar">
// //         <div className="search-filter-container">
// //           <div className="search-bar">
// //             <input
// //               type="text"
// //               placeholder="Search products..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //             <button onClick={handleSearch}>
// //               <FontAwesomeIcon icon={faSearch} />
// //             </button>
// //           </div>
// //           <button className="filter-icon" onClick={toggleFilters}>
// //             <FontAwesomeIcon icon={faFilter} />
// //           </button>
// //         </div>
// //       </div>

// //       {showFilters && (
// //         <ProductFilters
// //           colorFilters={colorFilters}
// //           setColorFilters={setColorFilters}
// //           sizeFilters={sizeFilters}
// //           setSizeFilters={setSizeFilters}
// //           brandFilters={brandFilters}
// //           setBrandFilters={setBrandFilters}
// //           priceSortOption={priceSortOption}
// //           setPriceSortOption={setPriceSortOption}
// //           alphabeticalSortOption={alphabeticalSortOption}
// //           setAlphabeticalSortOption={setAlphabeticalSortOption}
// //           minPrice={minPrice}
// //           setMinPrice={setMinPrice}
// //           maxPrice={maxPrice}
// //           setMaxPrice={setMaxPrice}
// //         />
// //       )}

// //       <div className="products-grid">
// //         {filteredProducts.map((product) => (
// //           <div
// //             key={product._id}
// //             className="product-card"
// //             onClick={() => handleProductClick(product._id)}
// //           >
// //             <img
// //               src={product.images?.[0] || "/default-image.jpg"}
// //               alt={product.product || "Product"}
// //               className="product-image"
// //             />
// //             <div className="product-info">
// //               <h3>{product.product}</h3>
// //               <p>{product.brand}</p>
// //               <p>Rs. {product.price}</p>
// //               <div className="product-actions">
// //                 <div className="icon-container">
// //                   <button
// //                     className={`wishlist-button ${wishlistIds.includes(product._id) ? 'active' : ''}`}
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       toggleWishlist(product._id);
// //                     }}
// //                     title="Add to Wishlist"
// //                   >
// //                     <FontAwesomeIcon icon={wishlistIds.includes(product._id) ? solidHeart : regularHeart} />
// //                   </button>
// //                   {product.link && (
// //                     <a
// //                       href={product.link}
// //                       target="_blank"
// //                       rel="noopener noreferrer"
// //                       className="external-link-button"
// //                       onClick={(e) => e.stopPropagation()}
// //                       title="Visit Product Page"
// //                     >
// //                       <FontAwesomeIcon icon={faExternalLinkAlt} />
// //                     </a>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {hasMore && (
// //         <div className="load-more">
// //           <button onClick={handleLoadMore}>Load More</button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default ProductsDisplay;






import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import "./ProductsDisplay.css";
import ProductFilters from "../Filters/ProductFilters";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const TOKEN_KEY = "token";
const FILTERS_STORAGE_KEY = "userFilters";
let debounceTimer;

const normalizeString = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, "");

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
  const [wishlistIds, setWishlistIds] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [submittedSearchTerm, setCurrentPage]);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const inputText = "I am looking for casual dresses in medium size, red color, and cotton material.";
        const response = await fetch("http://127.0.0.1:8000/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input_text: inputText }),
        });
        const productIds = await response.json();
        if (!Array.isArray(productIds) || productIds.length === 0) return;
        const fetchProductDetails = async (id) => {
          try {
            const res = await fetch(`https://sproj-p14-code.onrender.com/api/fetchproducts/${id}`);
            if (!res.ok) throw new Error(`Failed to fetch product with ID: ${id}`);
            return await res.json();
          } catch (error) {
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
    if (!userId) return;
    const payload = { userId, filterHistory: filters };
    try {
      const response = await fetch("http://localhost:10000/api/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to send filter data");
      }
    } catch (error) {
      console.error("Error sending filter data:", error);
    }
  };

  const fuseOptions = {
    keys: ["product"],
    threshold: 0.4,
    getFn: (obj, path) => normalizeString(obj[path])
  };
  const fuse = useMemo(() => new Fuse(products, fuseOptions), [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (submittedSearchTerm) {
      const fuseResults = fuse.search(normalizeString(submittedSearchTerm));
      result = fuseResults.map((res) => res.item);
    }

    result = result.filter((product) => {
      if (typeFilter !== "all" && product.type !== typeFilter) return false;
      if (colorFilters.length > 0 && !colorFilters.includes(product.filtercolor)) return false;
      if (sizeFilters.length > 0 && !sizeFilters.some(size => product.sizes.includes(size))) return false;
      if (brandFilters.length > 0 && !brandFilters.includes(product.brand)) return false;
      if (product.price < minPrice || product.price > maxPrice) return false;
      return true;
    });

    result = result.sort((a, b) => {
      if (priceSortOption === "price-asc") return a.price - b.price;
      if (priceSortOption === "price-desc") return b.price - a.price;
      if (alphabeticalSortOption === "A-Z") return a.product.localeCompare(b.product);
      if (alphabeticalSortOption === "Z-A") return b.product.localeCompare(a.product);
      return 0;
    });

    return result;
  }, [products, submittedSearchTerm, typeFilter, colorFilters, sizeFilters, brandFilters, priceSortOption, alphabeticalSortOption, minPrice, maxPrice, fuse]);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      const userId = localStorage.getItem("userId");
      const payload = { userId, blockId };
      fetch("http://localhost:10000/api/type-interest/pageClick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleProductClick = (productId) => {
    const userId = localStorage.getItem("userId");
    const payload = { userId, blockId };
    fetch("http://localhost:10000/api/type-interest/productClick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    navigate(`/product/${productId}`);
  };

  const logSearchQuery = async (query) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const searchPayload = { userId, query };
    try {
      await fetch("http://localhost:10000/api/searchhistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchPayload)
      });
    } catch (error) {
      console.error("Error logging search query:", error);
    }
  };

  const handleSearch = () => {
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

  useEffect(() => {
    const handleClickOutside = () => {
      if (showFilters) setShowFilters(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showFilters]);

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
  
    // Open the link immediately to prevent popup blocking
    window.open(product.link, "_blank", "noopener,noreferrer");
  
    // Tracking can run in the background
    const userId = localStorage.getItem("userId");
  
    fetch("http://localhost:10000/api/trackProductView/productRedirected", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        productId: product._id,
        price: product.price,
        sizes: product.sizes || [],
        type: product.type,
        gender: product.gender,
        filtercolor: product.filtercolor,
        brand: product.brand
      }),
    }).catch((error) => {
      console.error("Redirection tracking failed:", error);
    });
  };
  

  return (
    <div className="products-container">
      {/* <div className="top-bar">
        <div className="search-filter-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          <button className="filter-icon" onClick={toggleFilters}>
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
      </div> */}
      <div className="top-bar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>
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

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default ProductsDisplay;