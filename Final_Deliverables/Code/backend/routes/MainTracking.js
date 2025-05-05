import express from 'express';
import Product from '../models/Products.js';
import UserRecentProductClicks from '../models/UserRecentProductClicks.js';
import UserProductClickAggregate from '../models/UserProductClickAggregate.js';

const router = express.Router();
const debounceCache = new Map();

// Helper: Compute weighted score based on view count and redirection
const computeWeightedScore = ({ visitCount, redirected }) => {
    const visitPower = 0.9;
    const redirectionWeight = 3;
    return Math.pow(visitCount, visitPower) + (redirected ? redirectionWeight : 0);
};

// Helper: Create $inc and $push update objects
const createAggregateUpdate = (product, score) => {
    const { brand, gender, type, filtercolor, price, sizes } = product;
    const roundedScore = Math.floor(score);

    const update = {
        $inc: {
            [`aggregateData.brandCounts.${brand}`]: score,
            [`aggregateData.genderCounts.${gender}`]: score,
            [`aggregateData.typeCounts.${type}`]: score,
            [`aggregateData.filtercolorCounts.${filtercolor}`]: score,
        },
        $push: {
            'aggregateData.priceHistory': {
                $each: Array(roundedScore).fill(price), // Push price `roundedScore` times
            }
        },
    };

    sizes.forEach(size => {
        update.$inc[`aggregateData.sizeCounts.${size}`] = score;
    });

    return update;
};

// ➤ POST /api/trackProductView
router.post('/', async (req, res) => {
    const { userId, productId, price, sizes, type, gender, filtercolor, brand } = req.body;
    const clickedAt = new Date();

    if (!productId || !gender || !type || !filtercolor || !brand) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const key = `${userId || "anonymous"}-${productId}`;

    if (debounceCache.has(key)) {
        clearTimeout(debounceCache.get(key).timeoutId);
    }

    const timeoutId = setTimeout(async () => {
        try {
            let doc = await UserRecentProductClicks.findOne({ userId });

            const productEntry = {
                productId,
                price,
                sizes,
                type,
                gender,
                filtercolor,
                brand,
                visitCount: 1,
                redirected: false,
                clickedAt,
            };

            let productToAggregate = null;

            if (!doc) {
                doc = new UserRecentProductClicks({
                    userId,
                    clickedProducts: [productEntry]
                });
            } else {
                const index = doc.clickedProducts.findIndex(p => p.productId.toString() === productId);

                if (index !== -1) {
                    const updatedProduct = doc.clickedProducts[index];
                    updatedProduct.visitCount += 1;
                    updatedProduct.clickedAt = clickedAt;

                    doc.clickedProducts.splice(index, 1);
                    doc.clickedProducts.push(updatedProduct);
                } else {
                    doc.clickedProducts.push(productEntry);

                    if (doc.clickedProducts.length > 40) {
                        productToAggregate = doc.clickedProducts.shift();
                    }
                }
            }

            await doc.save();

            if (productToAggregate) {
                const score = computeWeightedScore(productToAggregate);
                const update = createAggregateUpdate(productToAggregate, score);

                await UserProductClickAggregate.findOneAndUpdate(
                    { userId },
                    update,
                    { upsert: true, new: true }
                );
            }

            console.log(`Saved product view for ${key}`);
        } catch (err) {
            console.error(`Debounced save failed for ${key}:`, err);
        } finally {
            debounceCache.delete(key);
        }
    }, 1000);

    debounceCache.set(key, { timeoutId });

    return res.status(200).json({
        message: "Product view received. Will be tracked after a short delay if no duplicate received."
    });
});

// ➤ POST /api/productRedirected
router.post('/productRedirected', async (req, res) => {
    const { userId, productId, price, sizes, type, gender, filtercolor, brand } = req.body;
    const clickedAt = new Date();

    if (!productId || !gender || !type || !filtercolor || !brand) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const doc = await UserRecentProductClicks.findOne({ userId });
        if (!doc) return res.status(404).json({ error: 'User click history not found' });

        let productToAggregate = null;
        const index = doc.clickedProducts.findIndex(p => p.productId.toString() === productId);

        if (index !== -1) {
            const updatedProduct = doc.clickedProducts[index];
            updatedProduct.redirected = true;
            updatedProduct.clickedAt = clickedAt;

            doc.clickedProducts.splice(index, 1);
            doc.clickedProducts.push(updatedProduct);
        } else {
            const productEntry = {
                productId,
                price,
                sizes,
                type,
                gender,
                filtercolor,
                brand,
                visitCount: 1,
                redirected: true,
                clickedAt,
            };

            doc.clickedProducts.push(productEntry);

            if (doc.clickedProducts.length > 40) {
                productToAggregate = doc.clickedProducts.shift();
            }
        }

        await doc.save();

        if (productToAggregate) {
            const score = computeWeightedScore(productToAggregate);
            const update = createAggregateUpdate(productToAggregate, score);

            await UserProductClickAggregate.findOneAndUpdate(
                { userId },
                update,
                { upsert: true, new: true }
            );
        }

        return res.status(200).json({ message: 'Redirection tracked' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Redirection tracking failed' });
    }
});

export default router;
