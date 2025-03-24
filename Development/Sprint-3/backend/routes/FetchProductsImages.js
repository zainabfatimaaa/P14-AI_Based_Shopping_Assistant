import express from 'express';
import mongoose from 'mongoose';
import Product_Image from '../models/Products.js';

const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { ids } = req.body; 
        console.log(ids);

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'No product IDs provided' });
        }

        const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
        const products = await mongoose.connection.db.collection('productdata').find({ _id: { $in: objectIds } }).toArray();

        const images = products.map(product => {
            const imageUrls = product.images.slice(0, 2); 
            return imageUrls;
        });

        res.json({ images });
    } catch (error) {
        const { ids } = req.body; 
        console.error('Error fetching product images:', error, ids);
        res.status(500).json({ error: 'Failed to fetch product images' });
    }
});

export default router;

