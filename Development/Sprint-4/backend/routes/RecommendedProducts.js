import express from 'express';
import Product from '../models/Products.js';
import fetch from 'node-fetch'; // or use axios if you prefer

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log("HERERERR");
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Call the Flask backend API to get recommended product IDs
    const flaskResponse = await fetch(`http://127.0.0.1:5000/get-top-100?user_id=${userId}`);
    
    if (!flaskResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch recommendations from Python backend' });
    }

    const recommendations = await flaskResponse.json();

    // Extract product IDs from the Flask response
    const productIds = recommendations.map(item => item.product_id);

    // Fetch the full product documents from MongoDB
    const recommendedProducts = await Product.find({ _id: { $in: productIds } });

    // // Log the first product for debugging
    // if (recommendedProducts.length > 0) {
    //   console.log("First Recommended Product:\n", recommendedProducts[0]);
    // }

    // Return full products (same format as main product fetch)
    res.json(recommendedProducts);
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    res.status(500).json({ error: 'An error occurred while fetching recommended products' });
  }
});

export default router;
