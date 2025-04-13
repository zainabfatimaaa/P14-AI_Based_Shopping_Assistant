import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Account from '../models/UserAccount.js';
import Product from '../models/Products.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const finalWishlist = [];

    for (const item of req.user.wishlist) {
      const productFromDB = await Product.findById(item.productId).lean(); // lean for plain JS object

      if (productFromDB) {
        // Include the full DB product info, including _id
        finalWishlist.push({
          ...productFromDB,
          productId: productFromDB._id,
        });
      } else {
        // Return fallback with message
        finalWishlist.push({
          productId: item.productId,
          product: item.product,
          price: item.price,
          primary_colour: item.primary_colour,
          gender: item.gender,
          images: item.images,
          brand: item.brand,
          message: 'Product not available',
        });
      }
    }

    res.status(200).json({ wishlist: finalWishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Assuming Express route: GET /api/wishlist/unavailable/:id
router.get('/unavailable/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // console.log('[DEBUG] Requested productId:', id);
  // console.log('[DEBUG] Authenticated user ID:', userId);

  try {
    const user = await Account.findById(userId);


    // console.log('[DEBUG] User wishlist length:', user.wishlist.length);

    const product = user.wishlist.find(item => {
      // console.log('[DEBUG] Checking productId in wishlist:', item.productId.toString());
      return item.productId.toString() === id;
    });

    if (!product) {
      // console.log('[DEBUG] Product not found in wishlist.');
      return res.status(404).json({ message: 'Unavailable product not found in wishlist' });
    }

    // console.log('[DEBUG] Product found:', product);
    return res.json(product);

  } catch (err) {
    // console.error('[ERROR] Failed to fetch unavailable product:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});



router.post('/add/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    console.log('Attempting to add to wishlist, productId:', productId);

    const product = await Product.findById(productId);
    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ error: 'Product not found' });
    }

    const alreadyExists = req.user.wishlist.some(item =>
      item.productId.toString() === productId
    );
    if (alreadyExists) {
      console.log('Product already in wishlist');
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    const newItem = {
      productId,
      product: product.product,
      price: product.price,
      primary_colour: product.primary_colour,
      gender: product.gender,
      images: product.images,
      brand: product.brand,
      message: '',
    };

    console.log('Adding item to wishlist:', newItem);
    req.user.wishlist.push(newItem);

    await req.user.save();
    console.log('Wishlist after adding:', req.user.wishlist);

    res.status(200).json({ message: 'Product added to wishlist', wishlist: req.user.wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Failed to add product to wishlist' });
  }
});

router.delete('/remove/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    console.log('Attempting to remove productId from wishlist:', productId);

    req.user.wishlist = req.user.wishlist.filter(item =>
      item.productId.toString() !== productId
    );

    await req.user.save();
    console.log('Wishlist after removal:', req.user.wishlist);

    res.status(200).json({ message: 'Product removed from wishlist', wishlist: req.user.wishlist });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove product from wishlist' });
  }
});

export default router;
