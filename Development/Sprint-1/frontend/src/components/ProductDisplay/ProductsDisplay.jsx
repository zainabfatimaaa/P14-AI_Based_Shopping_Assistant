import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductsDisplay.css';

const uniqueColors = ['Grey', 'White', 'Red', 'Green', 'Brown', 'Black', 'Blue', 'Beige', 'Orange',
    'Pink', 'Yellow', 'Purple', 'Multi-color', 'Other'];

const uniqueSizes = ['S', 'M', 'L', 'XL', '2XL', 'XS', '3XL', '4XL', '30', '32', '34', '36', '38', '40', 
    '28', '33', '24', '26', 'S-M', 'L-XL', 'M-L', 'XS-S'];

const uniqueTypes = [
    'T-Shirt', 'Hoodies & Sweatshirts', 'Sweaters & Cardigans', 'Jackets & Coats', 'Blazers', 'Polo',
    'Shirts', 'Trousers', 'Jeans', 'Shorts', 'Fur & Fleece', 'Bodysuits', 'Dresses & Skirts', 
    'Camisole & Bandeaus', 'Tops & Blouses', 'TrueBody', 'Activewear', 'Co-ords'
];

const TOKEN_KEY = 'token';

function ProductsDisplay({ products }) {
    const [productsPerRow, setProductsPerRow] = useState(4);
    const [typeFilter, setTypeFilter] = useState('all');
    const [colorFilter, setColorFilter] = useState('all');
    const [sizeFilter, setSizeFilter] = useState('all');
    const [priceSortOption, setPriceSortOption] = useState('none');
    const [storeFilter, setStoreFilter] = useState('all');
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem(TOKEN_KEY);

    // Fetch wishlist on component mount
    useEffect(() => {
        const fetchWishlist = async () => {
            if (token) {
                try {
                    const response = await fetch('https://sproj-p14-code.onrender.com/api/wishlist', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    setWishlist(data.wishlist.map(product => product._id));
                } catch (error) {
                    console.error('Failed to fetch wishlist:', error);
                }
            }
        };
        fetchWishlist();
    }, [token]);

    // Tracking API calls
    const trackBehavior = async (productId, eventType) => {
        try {
            await axios.post('/api/track', {
                userId: token ? 'userIdPlaceholder' : null, // Replace with actual user ID decoding logic
                productId,
                eventType,
            });
        } catch (error) {
            console.error(`Failed to track ${eventType}:`, error);
        }
    };

    // Filters and Sorting
    const filteredAndSortedProducts = [...products]
        .filter(product => {
            if (typeFilter !== 'all' && product.type !== typeFilter) return false;
            if (colorFilter !== 'all' && product.filtercolor !== colorFilter) return false;
            if (sizeFilter !== 'all' && !product.sizes.includes(sizeFilter)) return false;
            if (storeFilter !== 'all' && product.brand.toLowerCase() !== storeFilter.toLowerCase()) return false;
            return true;
        })
        .sort((a, b) => {
            if (priceSortOption === 'price-asc') return a.price - b.price;
            if (priceSortOption === 'price-desc') return b.price - a.price;
            return 0;
        });

    // Handle wishlist toggle and track it
    const toggleWishlist = async (productId) => {
        if (token) {
            try {
                if (wishlist.includes(productId)) {
                    await fetch(`https://sproj-p14-code.onrender.com/api/wishlist/remove/${productId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setWishlist(wishlist.filter(id => id !== productId));
                } else {
                    await fetch(`https://sproj-p14-code.onrender.com/api/wishlist/add/${productId}`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setWishlist([...wishlist, productId]);
                    trackBehavior(productId, 'wishlist'); // Track wishlist addition
                }
            } catch (error) {
                console.error('Failed to update wishlist:', error);
            }
        } else {
            console.log("No token found, cannot modify wishlist");
        }
    };

    // Handle product redirection link click
    const handleRedirectionClick = (productId, link) => {
        trackBehavior(productId, 'redirection_click'); // Track redirection click
        window.open(link, '_blank');
    };

    // Handle product card click
    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleResetFilters = () => {
        setTypeFilter('all');
        setColorFilter('all');
        setSizeFilter('all');
        setPriceSortOption('none');
        setStoreFilter('all');
    };

    if (!products || products.length === 0) {
        return <div>Loading Products...</div>;
    }

    return (
        <div className="products-container">
            <div className="filters-container">
                <div className="options">
                    <select id="type-filter" onChange={(e) => setTypeFilter(e.target.value)} value={typeFilter}>
                        <option value="all">Category</option>
                        {uniqueTypes.map(type => (
                            <option key={type} value={type}>
                                {type}
                            </option>
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
                    <select id="store-filter" onChange={(e) => setStoreFilter(e.target.value)} value={storeFilter}>
                        <option value="all">Store</option>
                        <option value="Lama">Lama</option>
                        <option value="Outfitters">Outfitters</option>
                    </select>
                </div>
                <div className="options">
                    <select id="color-filter" onChange={(e) => setColorFilter(e.target.value)} value={colorFilter}>
                        <option value="all">Color</option>
                        {uniqueColors.map(color => (
                            <option key={color} value={color}>
                                {color}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="options">
                    <select id="size-filter" onChange={(e) => setSizeFilter(e.target.value)} value={sizeFilter}>
                        <option value="all">Size</option>
                        {uniqueSizes.map(size => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="reset-button-container">
                    <button onClick={handleResetFilters} className="reset-button">Reset</button>
                </div>
            </div>
            <div className="products-grid" style={{ gridTemplateColumns: `repeat(${productsPerRow}, 1fr)` }}>
                {filteredAndSortedProducts.map(product => (
                    <div
                        key={product._id}
                        className="product-card"
                        onClick={() => handleCardClick(product._id)} // Navigate to product details
                    >
                        <img
                            src={product.images[0]}
                            alt={product.product}
                            className="product-image"
                        />
                        <div className="product-info">
                            <h3 className="product-name">{product.product}</h3>
                            <p className="product-brand">{product.brand}</p>
                            <p className="product-price">Rs. {product.price ? product.price : 'N/A'}</p>
                        </div>
                        <div className="product-actions">
                            <button
                                className="external-link-button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering the card click
                                    handleRedirectionClick(product._id, product.link);
                                }}
                            >
                                <i className="fas fa-external-link-alt"></i>
                            </button>
                            {token && (
                                <button
                                    className={`wishlist-button ${wishlist.includes(product._id) ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the card click
                                        toggleWishlist(product._id);
                                    }}
                                >
                                    <i className={wishlist.includes(product._id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductsDisplay;
