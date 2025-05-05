import express from 'express';
import Product from '../models/Products.js';
import fetch from 'node-fetch'; // or use axios if you prefer

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log("HERERERRff");
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log(userId);

    console.log("HERER1faafaaa");
    // Call the Flask backend API to get recommended product IDs
    // const flaskResponse = await fetch(`http://127.0.0.1:5020/get-top-100?user_id=${userId}`);
    const flaskResponse = await fetch(`https://flask-recommender-j2rs.onrender.com/get-top-100?user_id=${userId}`);
    console.log("HERER1fddf");
    if (!flaskResponse.ok) {
      return res.status(501).json({ error: 'Failed to fetch recommendations from Python backend' });
    }

    console.log("HERER1ff");

    const recommendations = await flaskResponse.json();

    // Sort recommendations by final_cosine_score (highest to lowest)
    recommendations.sort((a, b) => b.final_cosine_score - a.final_cosine_score);

    console.log('Recommendations:', recommendations);
    console.log('Number of recommendations:', recommendations.length);

    const productIds = recommendations.map(item => item.product_id);

    const products = await Product.find({
      _id: { $in: productIds }
    }).exec();

    // Convert products to a Map for fast lookup
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    // Reorder products to match the order of productIds
    const recommendedProducts = productIds.map(id => productMap.get(id)).filter(p => p);

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
