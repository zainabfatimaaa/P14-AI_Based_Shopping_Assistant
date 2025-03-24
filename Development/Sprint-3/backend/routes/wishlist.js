
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Account from '../models/UserAccount.js';
import Product from '../models/Products.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const wishlistProductIds = req.user.wishlist;
    const wishlistProducts = await Product.find({ _id: { $in: wishlistProductIds } });

    res.status(200).json({ wishlist: wishlistProducts });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

router.post('/add/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (req.user.wishlist.includes(productId)) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    req.user.wishlist.push(productId);
    await req.user.save();

    res.status(200).json({ message: 'Product added to wishlist', wishlist: req.user.wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Failed to add product to wishlist' });
  }
});

router.delete('/remove/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    req.user.wishlist = req.user.wishlist.filter(id => id.toString() !== productId);
    await req.user.save();

    res.status(200).json({ message: 'Product removed from wishlist', wishlist: req.user.wishlist });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove product from wishlist' });
  }
});

export default router;
