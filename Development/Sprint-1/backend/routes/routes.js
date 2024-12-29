import express from 'express';
import signUpRoute from './SignUp.js';
import signInRoute from './SignIn.js';
import fetchProducts from './FetchProducts.js';
import wishlistRoutes from './wishlist.js';
import { trackBehavior } from './TrackBehavior.js';

const router = express.Router();

// Mount the routes
router.use('/signup', signUpRoute);
router.use('/signin', signInRoute);
router.use('/fetchproducts', fetchProducts);
router.use('/wishlist', wishlistRoutes);

// Route to track user behavior
router.post('/track', trackBehavior);

export default router;
