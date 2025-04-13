import express from 'express';
import Product from '../models/Products.js';

const router = express.Router();

// Route to fetch all products (only returns product data with image URLs)
router.get('/', async (req, res) => {
    try {
      const { skip = 0, limit = 30 } = req.query; // Default to skip=0, limit=30
      const products = await Product.find()
        .skip(parseInt(skip))
        .limit(parseInt(limit));
      console.log('Using Collection:', Product.collection.name);
  
      if (products.length > 0) {
        console.log('First Product Details:', products[0]);
      } else {
        console.log('No products found.');
      }
  
      // Log the response (products) and number of products fetched
      console.log('API Response (Products):', JSON.stringify(products, null, 2)); // Pretty-print the products array
      console.log('Number of Products Fetched:', products.length);
  
      // Respond with product data including image URLs
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

// New route to fetch a product by its ID and display product details
router.get('/:id', async (req, res) => {
    try {
        // Fetch a single product by its ID
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Log the product details (for debugging)
        console.log('Product Details:', product);

        // Respond with the product data, including image URLs
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product details' });
    }
});

export default router;
