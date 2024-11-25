import React, { useState, useEffect } from 'react';  // Added useEffect import
import { useNavigate } from 'react-router-dom';
import './ProductsDisplay.css';

const uniqueColors = [
    'CHOCOLATE', 'DARK GREY', 'OLIVE', 'CHARCOAL', 'IVORY', 'BEIGE', 'GREEN', 'LIGHT PINK', 'TAUPE', 
    'MIDNIGHT BLUE', 'COFFEE', 'BURGUNDY', 'MAROON', 'BLUE', 'ALL BLACK', 'BLACK', 'BROWN', 'SAND', 
    'HEATHER GREY', 'DIRTY PINK', 'WINE', 'GREY', 'CREAM', 'CAMEL', 'DARK RED', 'NAVY', 'OATMEAL', 
    'LIGHT BLUE', 'TEAL', 'OFF WHITE', 'KHAKI', 'WHITE', 'HEATHER CHARCOAL', 'ITALIAN CLAY', 
    'DARK BROWN', 'DARK OLIVE'
];

const uniqueSizes = [
    '0X-TRUE', 'XX-LARGE', 'SMALL', '1X-TRUE', '1X-TRUE (3XL)', 'LARGE', '2X-TRUE', '0X-TRUE (2XL)', 
    'MEDIUM', '2X-TRUE (4XL)', 'X-LARGE', 'X-SMALL'
];

function ProductsDisplay({ products }) {
    const [productsPerRow, setProductsPerRow] = useState(4);
    const [nameSortOption, setNameSortOption] = useState('none');
    const [priceSortOption, setPriceSortOption] = useState('none');
    const [genderFilter, setGenderFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [colorFilter, setColorFilter] = useState('all');
    const [sizeFilter, setSizeFilter] = useState('all');
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    // Fetch wishlist items on component mount
    useEffect(() => {
        const fetchWishlist = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:8000/api/wishlist', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    setWishlist(data.wishlist.map(product => product._id)); // Store only IDs for easy checking
                } catch (error) {
                    console.error('Failed to fetch wishlist:', error);
                }
            }
        };
        fetchWishlist();
    }, []);

    const handleProductsPerRowChange = (event) => {
        setProductsPerRow(Number(event.target.value));
    };

    const handleNameSortChange = (event) => {
        setNameSortOption(event.target.value);
    };

    const handlePriceSortChange = (event) => {
        setPriceSortOption(event.target.value);
    };

    const handleGenderFilterChange = (event) => {
        setGenderFilter(event.target.value);
    };

    const handleTypeFilterChange = (event) => {
        setTypeFilter(event.target.value);
    };

    const handleColorFilterChange = (event) => {
        setColorFilter(event.target.value);
    };

    const handleSizeFilterChange = (event) => {
        setSizeFilter(event.target.value);
    };

    const filteredAndSortedProducts = [...products]
        .filter(product => {
            if (genderFilter !== 'all' && product.gender !== genderFilter) return false;
            if (typeFilter !== 'all' && product.type !== typeFilter) return false;
            if (colorFilter !== 'all' && product.primary_color !== colorFilter) return false;
            if (sizeFilter !== 'all' && !product.sizes.includes(sizeFilter)) return false;
            return true;
        })
        .sort((a, b) => {
            if (nameSortOption !== 'none') {
                const nameComparison = a.name.localeCompare(b.name);
                if (nameSortOption === 'name-asc') return nameComparison;
                if (nameSortOption === 'name-desc') return -nameComparison;
            }

            if (priceSortOption !== 'none') {
                const priceComparison = a.price - b.price;
                if (priceSortOption === 'price-asc') return priceComparison;
                if (priceSortOption === 'price-desc') return -priceComparison;
            }

            return 0;
        });

    const toggleWishlist = async (productId) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                if (wishlist.includes(productId)) {
                    await fetch(`http://localhost:8000/api/wishlist/remove/${productId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setWishlist(wishlist.filter(id => id !== productId));
                } else {
                    await fetch(`http://localhost:8000/api/wishlist/add/${productId}`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setWishlist([...wishlist, productId]);
                }
            } catch (error) {
                console.error('Failed to update wishlist:', error);
            }
        } else {
            console.log("No token found, cannot modify wishlist");
        }
    };

    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (!products || products.length === 0) {
        return <div>No products available</div>; // Display message if products are not passed or empty
    }

    return (
        <div className="products-container">
            <div className="filters-container">
                <div className="options">
                    <label htmlFor="products-per-row">Products per row: </label>
                    <select id="products-per-row" onChange={handleProductsPerRowChange} value={productsPerRow}>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div className="options">
                    <label htmlFor="name-sort-by">Sort By Name: </label>
                    <select id="name-sort-by" onChange={handleNameSortChange} value={nameSortOption}>
                        <option value="none">None</option>
                        <option value="name-asc">Name A-Z</option>
                        <option value="name-desc">Name Z-A</option>
                    </select>
                </div>
                <div className="options">
                    <label htmlFor="price-sort-by">Sort By Price: </label>
                    <select id="price-sort-by" onChange={handlePriceSortChange} value={priceSortOption}>
                        <option value="none">None</option>
                        <option value="price-asc">Price low to high</option>
                        <option value="price-desc">Price high to low</option>
                    </select>
                </div>
                <div className="options">
                    <label htmlFor="gender-filter">Filter by Gender: </label>
                    <select id="gender-filter" onChange={handleGenderFilterChange} value={genderFilter}>
                        <option value="all">All</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                    </select>
                </div>
                <div className="options">
                    <label htmlFor="type-filter">Filter by Type: </label>
                    <select id="type-filter" onChange={handleTypeFilterChange} value={typeFilter}>
                        <option value="all">All</option>
                        <option value="T-Shirt">T-Shirt</option>
                        <option value="Hoodie/Sweatshirt">Hoodie/Sweatshirt</option>
                    </select>
                </div>
                <div className="options">
                    <label htmlFor="color-filter">Filter by Color: </label>
                    <select id="color-filter" onChange={handleColorFilterChange} value={colorFilter}>
                        <option value="all">All</option>
                        {uniqueColors.map(color => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                    </select>
                </div>
                <div className="options">
                    <label htmlFor="size-filter">Filter by Size: </label>
                    <select id="size-filter" onChange={handleSizeFilterChange} value={sizeFilter}>
                        <option value="all">All</option>
                        {uniqueSizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
            </div>
    
            <div className="products-grid" style={{ gridTemplateColumns: `repeat(${productsPerRow}, 1fr)` }}>
                {filteredAndSortedProducts.map((product) => (
                    <div 
                        key={product._id} 
                        className="product-card" 
                        onClick={() => handleCardClick(product._id)}
                    >
                        <img 
                            src={`images/${product._id}/image1.jpg`}
                            alt={product.name} 
                            className="product-image"
                        />
    
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-brand">LAMA Retail</p>
                            <p className="product-price">Rs. {product.price ? product.price : "N/A"}</p>
                        </div>
    
                        <div className="product-actions">
                            <button className="cart-button">
                                <i className="fas fa-cart-plus"></i>
                            </button>
                            <button 
                                className={`wishlist-button ${wishlist.includes(product._id) ? 'active' : ''}`} 
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click
                                    toggleWishlist(product._id);
                                }}
                            >
                                <i className={wishlist.includes(product._id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );    
}

export default ProductsDisplay;
