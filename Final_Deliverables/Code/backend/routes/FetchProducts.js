import express from 'express';
import Product from '../models/Products.js';

const router = express.Router();

// Route to fetch all products (only returns product data with image URLs)
router.get('/', async (req, res) => {
    try {
      const { limit } = req.query; 
      let products;
      if (limit) {
        products = await Product.find().limit(parseInt(limit));
      }
      else {
        products = await Product.find();
      }
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
