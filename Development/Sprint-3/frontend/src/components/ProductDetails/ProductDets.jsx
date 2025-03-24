import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import './ProductDets.css'; // Make sure to create and style this CSS file
import Header from '../Header/Header';

function ProductDetails() {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://sproj-p14-code.onrender.com/api/fetchproducts/${id}`); // Replace with your API URL
                console.log("res: ", response);
                if (!response.ok) throw new Error('Failed to fetch product');
                const data = await response.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setGenderFilter={setGenderFilter}
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
                    {product.colors.length > 0 ? product.colors.join(', ') : 'No colors available'}
                </p>

                {/* Display Available Sizes */}
                <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>Available Sizes:</strong>
                    {product.sizes.length > 0 ? product.sizes.join(', ') : 'No sizes available'}
                </p>

                {/* Display Product Type */}
                <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>Product Type:</strong> {product.type}</p>

                {/* Display Gender */}
                <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>Gender:</strong> {product.gender}</p>

                {/* Display Redirection Link */}
                <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>Redirection Link:</strong>
                    <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2' }}>
                        {product.link}
                    </a>
                </p>

                <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>________________________________________________________________________</strong></p>
                <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>OTHER IMAGES</strong></p>

                {/* Display Other Images */}
                <div className="other-images">
                    {product.images.slice(1).map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`${product.product} - Image ${index + 2}`} // Start from image2
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
