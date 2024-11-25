// // import React from 'react';
// // import Header from '../Header/Header.jsx';
// // import ProductsDisplay from '../ProductDisplay/ProductsDisplay.jsx'

// // function LandingPageC() {
// //   return (
// //     <>
// //       <Header/>
// //       < ProductsDisplay/>
// //     </>
// //   );
// // }

// // export default LandingPageC;
// // LandingPageC.jsx
// import React, { useState, useEffect } from 'react';
// import Header from '../Header/Header.jsx';
// import ProductsDisplay from '../ProductDisplay/ProductsDisplay.jsx';
// import './LandingPage.css';


// function LandingPageC() {
//   const [products, setProducts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState(''); // Search query for filtering products

//   // Fetch products from the backend
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const response = await fetch('http://localhost:8000/api/fetchproducts');
//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     }
//     fetchProducts();
//   }, []);

//   // Filter products based on search query
//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <>
//       <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> {/* Pass search props */}
//       <ProductsDisplay products={filteredProducts} /> {/* Pass filtered products */}
//     </>
//   );
// }

// export default LandingPageC;



// LandingPageC.jsx
import React, { useState, useEffect } from 'react';
import Header from '../Header/Header.jsx';
import ProductsDisplay from '../ProductDisplay/ProductsDisplay.jsx';
import './LandingPage.css';

function LandingPageC() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Search query for filtering products

  // Fetch products from the backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:8000/api/fetchproducts');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> {/* Pass search props */}
      <ProductsDisplay products={filteredProducts} /> {/* Pass filtered products */}
    </>
  );
}

export default LandingPageC;
