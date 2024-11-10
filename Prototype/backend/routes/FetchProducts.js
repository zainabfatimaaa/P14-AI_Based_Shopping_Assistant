import express from 'express';
import Product from '../models/Products.js';  
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up the folder for storing images (move up one directory to the project root)
const imagesDir = path.join(__dirname, '../..', 'frontend', 'public', 'images');

// Debugging: Ensure imagesDir is correctly constructed
console.log("Images Directory Path:", imagesDir);

// Route to fetch all products
router.get('/', async (req, res) => {
    try {
        // const products = await Product.find();
        const products = await Product.find().limit(4);

        for (const product of products) {
            const productFolder = path.join(imagesDir, product._id.toString());

            // Create a folder for the product if it doesn't exist
            if (!fs.existsSync(productFolder)) {
                fs.mkdirSync(productFolder, { recursive: true });
            }

            // Save each image (if not already saved)
            product.images.forEach((imageBuffer, index) => {
                const imagePath = path.join(productFolder, `image${index + 1}.jpg`);

                // Check if the image already exists to prevent duplicates
                if (!fs.existsSync(imagePath)) {
                    fs.writeFileSync(imagePath, imageBuffer);
                }
            });
            
        }

        res.json(products); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' }); 
    }
});


// New route to fetch a product by its ID
router.get('/:id', async (req, res) => {
    try {
        console.log("id", req.params)
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product details' });
    }
});

export default router;
