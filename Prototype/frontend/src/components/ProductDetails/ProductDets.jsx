import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDets.css'; // Make sure to create and style this CSS file

function ProductDetails() {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/fetchproducts/${id}`); // Replace with your API URL
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
        <div className="product-details">
            {/* Display Product Name */}
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>{product.name}</h2>

            {/* Display Brand */}
            <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>LAMA Retail</strong></p>

            {/* Display Price */}
            <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>Rs.</strong> {product.price}</p>

            {/* Display First Image */}
            <img
                src={`/images/${product._id}/image1.jpg`}
                alt={`${product.name} - Image 1`}
                className="product-image"
                style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', marginBottom: '20px' }}
                onError={(e) => e.target.style.display = 'none'} // Hide image if not available
            />

            {/* Display Available Colors */}
            <p style={{ fontSize: '18px', marginBottom: '10px' }}><strong>Available Colors:</strong> 
                {product.colors.length > 0 ? product.colors.join(', ') : 'No colors available'}
            </p>

            {/* Display Available Sizes */}
            <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>Available Sizes:</strong> 
                {product.sizes.length > 0 ? product.sizes.join(', ') : 'No sizes available'}
            </p>

            {/* Display Redirection Link */}
            <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>Redirection Link:  </strong> 
                <a href={product.redirect_link} target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2' }}>
                    {product.redirect_link}
                </a>
            </p>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>________________________________________________________________________</strong></p>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}><strong>OTHER IMAGES</strong></p>

            {/* Display Other Images */}
            <div className="other-images">
                {Array.from({ length: 10 }).map((_, index) => {
                    const imageNumber = index + 2; // Start from image2.jpg
                    const imageUrl = `/images/${product._id}/image${imageNumber}.jpg`;

                    return (
                        <img
                            key={imageNumber}
                            src={imageUrl}
                            alt={`${product.name} - Image ${imageNumber}`}
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
                    );
                })}
            </div>
        </div>

    );
}

export default ProductDetails;
