import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductsDisplay.css';

const TOKEN_KEY = 'token';

function TopPicks({ allProducts }) {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem(TOKEN_KEY);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch('https://sproj-p14-code.onrender.com.com/api/recommendations', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch recommendations');
                }
                const recommendedIds = await response.json();
                const filteredProducts = allProducts.filter(product => recommendedIds.includes(product._id));
                setRecommendedProducts(filteredProducts);
            } catch (error) {
                console.error('Failed to fetch recommendations:', error);
            }
        };
        fetchRecommendations();
    }, [allProducts, token]);

    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="top-picks-container">
            <h2 className="top-picks-title">Top Picks for You</h2>
            <div className="scrollable-products">
                {recommendedProducts.map(product => (
                    <div
                        key={product._id}
                        className="product-card"
                        onClick={() => handleCardClick(product._id)}
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
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopPicks;
