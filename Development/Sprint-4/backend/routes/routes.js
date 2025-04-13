import express from 'express';
import signUpRoute from './SignUp.js';
import signInRoute from './SignIn.js';
import fetchProducts from './FetchProducts.js';
import wishlistRoutes from './wishlist.js';
import ChangePassword from './ChangePassword.js';
import UserInfo from './UserInfo.js'
import { trackBehavior } from './TrackBehavior.js';
import fetchImages from './FetchProductsImages.js';
import Product from '../models/Products.js';
import filterHistoryRoute from './FilterHistory.js';
import RedirectionLink from './RedirectionLink.js'
import trackingRoutes from './MainTracking.js'; 
import searchHistoryRoute from './SearchTracking.js';
import typeInterestRoute from './TypeInterest.js';
import recommendedProductsRoute from './RecommendedProducts.js';

const router = express.Router();

router.use('/signup', signUpRoute);
router.use('/signin', signInRoute);
router.use('/fetchproducts', fetchProducts);
router.use('/wishlist', wishlistRoutes);
router.use('/fetchproductimages', fetchImages)
router.use('/userinfo', UserInfo)
router.use('/change-password', ChangePassword)
router.use('/filters', filterHistoryRoute);
router.use('/searchhistory', searchHistoryRoute);
//router.use('/productlinkhistory', RedirectionLink);
router.post('/track', trackBehavior);
router.use('/trackProductView', trackingRoutes); 
router.use('/type-interest', typeInterestRoute);
router.use('/recommended-products', recommendedProductsRoute);


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
