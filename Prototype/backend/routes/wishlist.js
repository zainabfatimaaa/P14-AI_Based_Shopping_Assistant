// routes/wishlist.js
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Account from '../models/UserAccount.js';
import Product from '../models/Products.js';

const router = express.Router();

// Route to fetch wishlist products
router.get('/', authenticate, async (req, res) => {
  try {
    // Retrieve product IDs from user's wishlist
    const wishlistProductIds = req.user.wishlist;

    // Fetch product details for each ID
    const wishlistProducts = await Product.find({ _id: { $in: wishlistProductIds } });

    res.status(200).json({ wishlist: wishlistProducts });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});


// Route to add a product to the wishlist
router.post('/add/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;

    // Verify the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the product is already in the wishlist
    if (req.user.wishlist.includes(productId)) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    // Add product to user's wishlist
    req.user.wishlist.push(productId);
    await req.user.save();

    res.status(200).json({ message: 'Product added to wishlist', wishlist: req.user.wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Failed to add product to wishlist' });
  }
});

// Route to remove a product from the wishlist
router.delete('/remove/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;

    // Remove product from user's wishlist
    req.user.wishlist = req.user.wishlist.filter(id => id.toString() !== productId);
    await req.user.save();

    res.status(200).json({ message: 'Product removed from wishlist', wishlist: req.user.wishlist });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove product from wishlist' });
  }
});

export default router;
