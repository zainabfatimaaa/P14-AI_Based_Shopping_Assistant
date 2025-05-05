import express from "express";
import TypeInterest from "../models/TypeInterest.js";
import AggregatedTypeInterest from "../models/AggregatedTypeInterest.js";

const router = express.Router();

// Temporary module-level variables to track the last received combination and blockId
let lastGender = "";
let lastCategory = "";
let lastBlockId = "";
let timeoutId = null;

// POST /api/type-interest
router.post("/", async (req, res) => {
    try {
        console.log("Received request for type-interest");
        const { userId, blockId, gender, category } = req.body;

        // Validate required fields
        if (!blockId || !gender || !category) {
            return res.status(400).json({ error: "blockId, gender, and category are required." });
        }

        // Check if the received gender and category are the same as last time.
        if (gender === lastGender && category === lastCategory) {
            // Same combination: update lastBlockId and clear previous timeout.
            lastBlockId = blockId;
            if (timeoutId) clearTimeout(timeoutId);
        } else {
            // New combination: update all our temp variables.
            lastGender = gender;
            lastCategory = category;
            lastBlockId = blockId;
            if (timeoutId) clearTimeout(timeoutId);
        }

        // Set a new timeout to wait 5 seconds before committing to MongoDB.
        timeoutId = setTimeout(async () => {
            try {
                console.log("Debounce period elapsed. Pushing to MongoDB...");
                // Build filter based on whether userId is provided.
                const filter = userId ? { userId } : { userId: null };

                const newTypeBlock = {
                    blockId: lastBlockId,
                    gender,
                    category,
                    pagesClicked: 0,
                    productsClicked: 0,
                    lastUpdated: new Date()
                };

                // Push the block into the typeInterests array.
                const updatedDoc = await TypeInterest.findOneAndUpdate(
                    filter,
                    { $push: { typeInterests: newTypeBlock } },
                    { new: true, upsert: true }
                );

                // Check if typeInterests has more than 20 blocks
                if (updatedDoc.typeInterests.length > 20) {
                    // Sort to find the oldest block by lastUpdated
                    const sortedBlocks = [...updatedDoc.typeInterests].sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
                    const oldestBlock = sortedBlocks[0];

                    // Calculate weight
                    const weight = 1 + (0.5 * oldestBlock.pagesClicked) + (1 * oldestBlock.productsClicked);

                    // Update AggregatedTypeInterest
                    const aggFilter = userId ? { userId } : { userId: null };
                    const updateAgg = {
                        $inc: {
                            [`genderInterestMap.${oldestBlock.gender}`]: weight,
                            [`categoryInterestMap.${oldestBlock.category}`]: weight,
                        },
                    };

                    await AggregatedTypeInterest.findOneAndUpdate(
                        aggFilter,
                        updateAgg,
                        { upsert: true, new: true }
                    );

                    // Remove the oldest block using its blockId
                    await TypeInterest.updateOne(
                        filter,
                        { $pull: { typeInterests: { blockId: oldestBlock.blockId } } }
                    );

                    console.log(`Moved block ${oldestBlock.blockId} to AggregatedTypeInterest with weight ${weight}`);
                }

                console.log("Type interest recorded successfully:", {
                    blockId: lastBlockId,
                    userId: updatedDoc.userId,
                    currentTotalBlocks: updatedDoc.typeInterests.length,
                });
                // Optionally, you could notify someone or log further here.
            } catch (error) {
                console.error("Error saving debounced type interest block:", error);
            }
        }, 1000);

        // Immediately respond to the request.
        return res.status(200).json({
            message: "Request received. Your type-interest will be recorded after a 1-second debounce period.",
        });
    } catch (error) {
        console.error("Error in /api/type-interest:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Route for handling product click events
router.post("/productClick", async (req, res) => {
    try {
        const { userId, blockId } = req.body;

        if (!blockId) {
            return res.status(400).json({ error: "blockId and productId are required." });
        }

        const filter = userId ? { userId } : { userId: null };

        await TypeInterest.updateOne(
            filter, 
            {
                $inc: { "typeInterests.$[elem].productsClicked": 1 },
                $set: { "typeInterests.$[elem].lastUpdated": new Date() }
            },
            { 
                arrayFilters: [{ "elem.blockId": blockId }] 
            }
        );
        return res.status(200).json({ message: "Product click recorded successfully." });
    } catch (error) {
        console.error("Error in /api/type-interest/productClick:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/pageClick", async (req, res) => {
    try {
      const { userId, blockId } = req.body;
  
      if (!blockId) {
        return res.status(400).json({ error: "blockId is required." });
      }
  
      const filter = userId ? { userId } : { userId: null };
  
      await TypeInterest.updateOne(
        filter,
        {
          $inc: { "typeInterests.$[elem].pagesClicked": 1 },
          $set: { "typeInterests.$[elem].lastUpdated": new Date() }
        },
        {
          arrayFilters: [{ "elem.blockId": blockId }]
        }
      );
  
      return res.status(200).json({ message: "Page click recorded successfully." });
    } catch (error) {
      console.error("Error in /api/type-interest/pageClick:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
});
  

export default router;
