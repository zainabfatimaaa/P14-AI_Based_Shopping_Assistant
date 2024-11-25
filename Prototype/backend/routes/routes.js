import express from 'express';
import signUpRoute from './SignUp.js';
import signInRoute from './SignIn.js';
import fetchProducts from './FetchProducts.js'
import wishlistRoutes from './wishlist.js';



const router = express.Router();

router.use('/signup', signUpRoute);
router.use('/signin', signInRoute);
router.use('/fetchproducts', fetchProducts);
router.use('/wishlist', wishlistRoutes);


export default router;
