// import express from 'express';
// import Product from '../models/Products.js'; // adjust the path if needed

// const router = express.Router();

// // Route to find a product by redirection link
// router.post('/findbylink', async (req, res) => {
//     const { link } = req.body;

//     if (!link) {
//         return res.status(400).json({ error: 'Link is required' });
//     }

//     try {
//         const product = await Product.findOne({ link });

//         if (!product) {
//             return res.status(404).json({ error: 'Product not found' });
//         }

//         console.log(product._id
//             )
//         return res.status(200).json({ productId: product._id });
//     } catch (error) {
//         console.error('Error finding product by link:', error);
//         return res.status(500).json({ error: 'Server error' });
//     }
// });

// export default router;



import express from 'express';
import Product from '../models/Products.js'; // adjust the path if needed

const router = express.Router();

// Route to find a product by redirection link
router.post('/', async (req, res) => {
    // Log the incoming request body to verify the link is being sent
    console.log('Incoming request body:', req.body);

    const { link } = req.body;

    if (!link) {
        console.log('No link provided in request body');
        return res.status(400).json({ error: 'Link is required' });
    }

    try {
        console.log('Searching for product with link:', link); // Debug the link being searched for
        const product = await Product.findOne({ link });

        if (!product) {
            console.log('Product not found for link:', link); // Log if product not found
            return res.status(404).json({ error: 'Product not found' });
        }

        console.log('Found product:', product); // Log the found product details
        return res.status(200).json({ productId: product._id });
    } catch (error) {
        console.error('Error finding product by link:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

export default router;
