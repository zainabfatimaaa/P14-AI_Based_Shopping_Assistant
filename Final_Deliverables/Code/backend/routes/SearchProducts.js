import express from 'express';
import  ProductData from '../models/ProductSearch.js';
import Fuse from 'fuse.js';

const router = express.Router();

//normalize strings
const normalizeString = (str) => {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, "");
};

// Search API
router.post('/search', async (req, res) => {
  const { query, skip = 0, limit = 10 } = req.body; 

  try {

    const products = await ProductData.find()
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean(); 

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    
    const fuseOptions = {
      includeScore: true,  
      keys: ['product', 'brand', 'detailed_description'],  
      threshold: 0.4,  
      getFn: (obj, path) => normalizeString(obj[path]),
    };

    const fuse = new Fuse(products, fuseOptions);
    const results = fuse.search(normalizeString(query)); 

    const matchingProducts = results.map(result => result.item);

    console.log('Number of Matching Products:', matchingProducts.length);
    console.log('API Response (Matching Products):', JSON.stringify(matchingProducts, null, 2));

    return res.status(200).json({ products: matchingProducts });
  } catch (error) {
    console.error('Error during search:', error);
    return res.status(500).json({ error: 'An error occurred while performing the search.' });
  }
});

export default router;
