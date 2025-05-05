import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDets.css';
import Header from '../Header/Header';

function ProductDetailsUnavailable() {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUnavailableProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('User not authenticated');

                const response = await fetch(`https://sproj-p14-code.onrender.com/api/wishlist/unavailable/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch unavailable product');
                const data = await response.json();

                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUnavailableProduct();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>No product found</p>;

    return (
        <div>
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="product-details">
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>{product.product}</h2>

                <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>{product.brand}</strong></p>
                <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>Rs.</strong> {product.price}</p>

                <img
                    src={product.images?.[0]}
                    alt={product.product}
                    className="product-image"
                    style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', marginBottom: '20px' }}
                    onError={(e) => e.target.style.display = 'none'}
                />

                <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>Primary Color:</strong> {product.primary_colour}</p>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>Gender:</strong> {product.gender}</p>
                <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>Oops! Product not available</strong> </p>

                <hr />
                <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>OTHER IMAGES (Unavailable)</strong></p>

                <div className="other-images">
                    {product.images?.slice(1).map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`${product.product} - Image ${index + 2}`}
                            className="product-image"
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                display: 'inline-block',
                            }}
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductDetailsUnavailable;
