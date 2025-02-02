import express from 'express';
import signUpRoute from './SignUp.js';
import signInRoute from './SignIn.js';
import fetchProducts from './FetchProducts.js';
import wishlistRoutes from './wishlist.js';
import { trackBehavior } from './TrackBehavior.js';
import fetchImages from './FetchProductsImages.js';
import Product from '../models/Products.js';



const router = express.Router();

router.use('/signup', signUpRoute);
router.use('/signin', signInRoute);
router.use('/fetchproducts', fetchProducts);
router.use('/wishlist', wishlistRoutes);
router.use('/fetchproductimages', fetchImages)

router.post('/track', trackBehavior);

router.get('/distinct-types', async (req, res) => {
    try {
        console.log("Fetching distinct product types..."); // Log when the route is called
        const distinctTypes = await Product.distinct('type'); // Fetch distinct types
        console.log("Distinct Types Found:", distinctTypes); // Log the output in the terminal
        res.json({ types: distinctTypes }); // Return the types to the client
    } catch (err) {
        console.error("Error fetching distinct types:", err); // Log errors in the terminal
        res.status(500).json({ error: 'Failed to fetch distinct types' }); // Send an error response
    }
});

export default router;
