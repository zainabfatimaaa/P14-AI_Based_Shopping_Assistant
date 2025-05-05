import express from "express";
import mongoose from "mongoose";
import UserRecentProductClicks from "../models/UserRecentProductClicks.js"; // your schema
import Product from '../models/Products.js';

const router = express.Router();

// POST /api/recently-viewed
router.post("/", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    // Get user's recent clicks
    const userClicks = await UserRecentProductClicks.findOne({ userId });

    if (!userClicks || !userClicks.clickedProducts.length) {
      return res.json([]);
    }

    // Get unique productIds, most recent first
    const productIds = userClicks.clickedProducts
      .sort((a, b) => b.clickedAt - a.clickedAt)
      .map(p => p.productId);

    const uniqueProductIds = [...new Set(productIds.map(id => id.toString()))].slice(0, 12);

    // Fetch full product details from Product collection
    const fullProducts = await Product.find({
      _id: { $in: uniqueProductIds.map(id => new mongoose.Types.ObjectId(id)) }
    });

    // Preserve original order
    const orderedProducts = uniqueProductIds.map(
      id => fullProducts.find(p => p._id.toString() === id)
    ).filter(Boolean); // remove undefined in case of deleted products

    return res.json(orderedProducts);

  } catch (error) {
    console.error("Error fetching recently viewed products:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
