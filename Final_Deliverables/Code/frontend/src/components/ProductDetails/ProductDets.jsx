import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import Header from "../Header/Header.jsx";
import './ProductDets.css';
import Footer from "../Footer/Footer.jsx"; 

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedImage, setSelectedImage] = useState('');
    const [similarProducts, setSimilarProducts] = useState([]);
    const [hoveredColor, setHoveredColor] = useState(null);

    useEffect(() => {
        const fetchFromAPI = async () => {
            try {
                const response = await fetch(`https://sproj-p14-code.onrender.com/api/fetchproducts/${id}`);
                if (!response.ok) throw new Error('Failed to fetch product');
                const data = await response.json();
                setProduct(data);
                setMainImage(data.images[0]);
                setSelectedImage(data.images[0]);
                setLoading(false);
                trackProductView(data);

                const products = JSON.parse(localStorage.getItem('allProducts'));
                if (products) {
                    findSimilarProducts(data, products); // use stored list
                }
            } catch (error) {
                console.error(error);
                setError(error.message);
                setLoading(false);
            }
        };

        const loadProduct = () => {
            const products = JSON.parse(localStorage.getItem('allProducts'));
            if (products) {
                const foundProduct = products.find(p => p._id === id);
                if (foundProduct) {
                    setProduct(foundProduct);
                    setMainImage(foundProduct.images[0]);
                    setSelectedImage(foundProduct.images[0]);
                    setLoading(false);
                    findSimilarProducts(foundProduct, products);
                    trackProductView(foundProduct);
                } else {
                    fetchFromAPI(); // fallback to API
                }
            } else {
                fetchFromAPI(); // fallback if no local products
            }
        };

        loadProduct();
    }, [id]);

    const getUserId = () => localStorage.getItem('userId');

    const cosineSimilarity = (vecA, vecB) => {
        const dotProduct = vecA.reduce((sum, val, idx) => sum + val * vecB[idx], 0);
        const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
        const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
        return dotProduct / (magA * magB);
    };

    const getProductVector = (product) => {
        return [
            product.price,
            product.colors?.length || 0,
            product.sizes?.length || 0,
        ];
    };

    const findSimilarProducts = (currentProduct, allProducts) => {
        const currentVector = getProductVector(currentProduct);

        const filtered = allProducts.filter(p =>
            p._id !== currentProduct._id &&
            p.type === currentProduct.type &&
            p.gender === currentProduct.gender &&
            p.filtercolor === currentProduct.filtercolor
        );

        const candidates = filtered.length >= 4
            ? filtered
            : allProducts.filter(p => p._id !== currentProduct._id);

        // Step 3: Compute cosine similarity
        const scored = candidates.map(p => ({
            product: p,
            score: cosineSimilarity(currentVector, getProductVector(p))
        }));

        // Step 4: Sort and pick top 4
        scored.sort((a, b) => b.score - a.score);
        setSimilarProducts(scored.slice(0, 4).map(item => item.product));
    };

    const trackProductView = async (productData) => {
        if (!productData) return;

        try {
            await fetch('https://sproj-p14-code.onrender.com/api/trackProductView', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: getUserId(),
                    productId: productData._id,
                    price: productData.price,
                    sizes: productData.sizes || [],
                    type: productData.type,
                    gender: productData.gender,
                    filtercolor: productData.filtercolor,
                    brand: productData.brand,
                }),
            });
        } catch (error) {
            console.error('Error tracking product view:', error);
        }
    };

    const sendRedirectionLink = async () => {
        if (!product) return;

        try {
            const response = await fetch('https://sproj-p14-code.onrender.com/api/trackProductView/productRedirected', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: getUserId(),
                    productId: product._id,
                    price: product.price,
                    sizes: product.sizes || [],
                    type: product.type,
                    gender: product.gender,
                    filtercolor: product.filtercolor,
                    brand: product.brand,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Error from backend:', data.error);
            }
        } catch (error) {
            console.error('Error during fetch request:', error);
        }
    };

    const getColorValue = (colorName) => {
        // 1. Try direct CSS color first
        const testEl = document.createElement('div');
        testEl.style.color = colorName;
        if (testEl.style.color !== '') {
            return colorName;
        }

        const colorLower = colorName.toLowerCase();

        const specificColors = {
            'charcoal': '#36454F',
            'navy': '#000080',
            'ivory': '#FFFFF0',
            'olive': '#808000',
            'burgundy': '#800020',
            'midnight blue': '#191970',
            'heather blue': '#6f8faf',
            'heather gray': '#B6B6B6',
            'heather': '#9999CC',
            'forest green': '#228B22',
            'royal blue': '#4169E1',
            'slate': '#708090',
            'mustard': '#FFDB58',
            'rust': '#B7410E',
            'lavender': '#E6E6FA',
            'mint': '#98FF98',
            'mauve': '#E0B0FF',
            'champagne': '#F7E7CE',
            'sage': '#BCB88A'
        };

        if (specificColors[colorLower]) {
            return specificColors[colorLower];
        }

        const baseColors = {
            'blue': '#0000FF',
            'red': '#FF0000',
            'green': '#008000',
            'yellow': '#FFFF00',
            'purple': '#800080',
            'pink': '#FFC0CB',
            'brown': '#A52A2A',
            'gray': '#808080',
            'grey': '#808080',
            'black': '#000000',
            'white': '#FFFFFF',
            'orange': '#FFA500',
            'teal': '#008080',
            'cyan': '#00FFFF',
            'magenta': '#FF00FF'
        };

        for (const [baseColor, hexValue] of Object.entries(baseColors)) {
            if (colorLower.includes(baseColor)) {
                if (colorLower.includes('light')) {
                    return lightenColor(hexValue);
                } else if (colorLower.includes('dark') || colorLower.includes('midnight') || colorLower.includes('deep')) {
                    return darkenColor(hexValue);
                } else if (colorLower.includes('pale') || colorLower.includes('soft')) {
                    return desaturateColor(hexValue);
                } else if (colorLower.includes('bright') || colorLower.includes('vivid')) {
                    return saturateColor(hexValue);
                } else if (colorLower.includes('heather')) {
                    return heatherColor(hexValue);
                }

                return hexValue;
            }
        }

        return '#E0E0E0';
    };

    function lightenColor(hex) {
        return blendColors(hex, '#FFFFFF', 0.3);
    }

    function darkenColor(hex) {
        return blendColors(hex, '#000000', 0.3);
    }

    function desaturateColor(hex) {
        return blendColors(hex, '#808080', 0.4);
    }

    function saturateColor(hex) {
        return hex;
    }

    function heatherColor(hex) {
        return blendColors(hex, '#D0D0D0', 0.25);
    }

    function blendColors(hex1, hex2, ratio) {
        function hexToRgb(hex) {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        function rgbToHex(r, g, b) {
            return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        const color1 = hexToRgb(hex1);
        const color2 = hexToRgb(hex2);

        if (!color1 || !color2) return hex1;

        const r = Math.round(color1.r * (1 - ratio) + color2.r * ratio);
        const g = Math.round(color1.g * (1 - ratio) + color2.g * ratio);
        const b = Math.round(color1.b * (1 - ratio) + color2.b * ratio);

        return rgbToHex(r, g, b);
    }

    const handleRedirection = () => {
        if (product && product.link) {
            sendRedirectionLink();

            window.open(product.link, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>No product found</p>;

    return (
        <><Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setGenderFilter={() => { }} // Empty function since we don't need this functionality here
            setCategoryFilter={() => { }} // Empty function since we don't need this functionality here
        />
            <div className="product-details-page">
                <div className="product-images">
                    <div className="thumbnails">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`thumbnail-${index}`}
                                className={`thumbnail ${selectedImage === img ? 'selected' : ''}`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>

                    <img src={selectedImage} alt="Main" className="main-image" />
                </div>

                <div className="product-info">
                    <h1 className="product-title">{product.product}</h1>
                    <p className="product-price">Rs.{product.price}</p>

                    <div className="color-options">
                        {product.colors.map((color, idx) => (
                            <div
                                key={idx}
                                className="color-square"
                                style={{ backgroundColor: getColorValue(color) }}
                                onMouseEnter={() => setHoveredColor(color)}
                                onMouseLeave={() => setHoveredColor(null)}
                            >
                                {hoveredColor === color &&
                                    <div className="color-tooltip">{color}</div>
                                }
                            </div>
                        ))}
                    </div>

                    <div className="size-section">
                        <p className="size-label">Size</p>
                        <div className="sizes">
                            {product.sizes.map((size, idx) => (
                                <div key={idx} className="size-box">
                                    {size}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="actions">
                        <button className="buy-now" onClick={handleRedirection}>GO TO WEBSITE</button>
                    </div>
                </div>
            </div>
            {similarProducts.length > 0 && (
                <div className="similar-products">
                    <h3>You May Also Like</h3>
                    <div className="product-list-horizontal">
                        {similarProducts.map((similarProduct) => (
                            <div key={similarProduct._id} className="product-item-horizontal">
                                <a href={`/product/${similarProduct._id}`}>
                                    <img src={similarProduct.images[0]} alt={similarProduct.product} />
                                </a>
                                <p>{similarProduct.product}</p>
                                <p>Rs.{similarProduct.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};

export default ProductDetails;