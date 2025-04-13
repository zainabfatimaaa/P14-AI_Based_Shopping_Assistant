import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import './ProductDets.css';
import Header from '../Header/Header';

function ProductDetails() {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://sproj-p14-code.onrender.com/api/fetchproducts/${id}`);
                console.log("res: ", response);
                if (!response.ok) throw new Error('Failed to fetch product');
                const data = await response.json();
                setProduct(data);
                setLoading(false);
                trackProductView(data);
            } catch (error) {
                console.error(error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Function to get user ID (simplified version)
    const getUserId = () => localStorage.getItem('userId');

    // Function to track product view with all required attributes
    const trackProductView = async (productData) => {
        if (!productData) return;
        
        try {
            await fetch('http://localhost:10000/api/trackProductView', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userId: getUserId(),
                    productId: productData._id,
                    price: productData.price,
                    sizes: productData.sizes || [],
                    type: productData.type,
                    gender: productData.gender,
                    filtercolor: productData.filtercolor,
                    brand: productData.brand
                }),
            });
        } catch (error) {
            console.error('Error tracking product view:', error);
        }
    };


    // Function to track redirection link click with all required attributes
    const sendRedirectionLink = async () => {
        if (!product) return;
        
        try {            
            const response = await fetch('http://localhost:10000/api/trackProductView/productRedirected', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userId: getUserId(),
                    productId: product._id,
                    price: product.price,
                    sizes: product.sizes || [],
                    type: product.type,
                    gender: product.gender,
                    filtercolor: product.filtercolor,
                    brand: product.brand
                }),
            });
            
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            
            if (!response.ok) {
                console.error('Error from backend:', data.error);
            }
        } catch (error) {
            console.error('Error during fetch request:', error);
        }
    };
    
    const handleRedirection = () => {
        if (product.link) {
            console.log('Handling redirection with link:', product.link);
            // Track the redirection click with all product attributes
            sendRedirectionLink();
        } else {
            console.log('No product link available to handle redirection');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>No product found</p>;
    
    return (
        <div>
            <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <div className="product-details">
                {/* Display Product Name */}
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>{product.product}</h2>

                {/* Display Brand */}
                <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>{product.brand}</strong></p>

                {/* Display Price */}
                <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>Rs.</strong> {product.price}</p>

                {/* Display Primary Image */}
                <img
                    src={product.images[0]} // Use the first image from the images array
                    alt={`${product.product} - Image 1`}
                    className="product-image"
                    style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', marginBottom: '20px' }}
                    onError={(e) => e.target.style.display = 'none'} // Hide image if not available
                />

                {/* Display Primary Color */}
                <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>Primary Color:</strong> {product.primary_color}</p>

                {/* Display Available Colors */}
                <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>Available Colors:</strong>
                    {product.colors && product.colors.length > 0 ? product.colors.join(', ') : 'No colors available'}
                </p>

                {/* Display Available Sizes */}
                <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>Available Sizes:</strong>
                    {product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : 'No sizes available'}
                </p>

                {/* Display Product Type */}
                <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>Product Type:</strong> {product.type}</p>

                {/* Display Gender */}
                <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>Gender:</strong> {product.gender}</p>

                {/* Display Redirection Link - Added onClick handler */}
                <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>Redirection Link:</strong>
                    <a 
                        href={product.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: '#1976D2' }}
                        onClick={handleRedirection} // Added onClick handler here
                    >
                        {product.link}
                    </a>
                </p>

                <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>________________________________________________________________________</strong></p>
                <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>OTHER IMAGES</strong></p>

                {/* Display Other Images */}
                <div className="other-images">
                    {product.images && product.images.slice(1).map((imageUrl, index) => (
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
                            onError={(e) => e.target.style.display = 'none'} // Hide image if not available
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;