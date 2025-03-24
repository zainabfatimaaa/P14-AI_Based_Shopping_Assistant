import express from 'express';
import Filter from '../models/AppliedFilter.js';
import AggregatedFilter from '../models/AggregatedFilters.js';

const router = express.Router();

let filterHistoryData = []; // Temporary storage for filters

// Route to receive filter history
router.post('/', async (req, res) => {
    try {
        const { userId, filterHistory } = req.body;
        if (!filterHistory) {
            return res.status(400).json({ error: "Filter history is required" });
        }

        const isResetPoint =
            filterHistory.colorFilters.length === 0 &&
            filterHistory.sizeFilters.length === 0 &&
            filterHistory.brandFilters.length === 0 &&
            filterHistory.minPrice === 0 &&
            filterHistory.maxPrice === 50000;

        if (isResetPoint) {
            if (filterHistoryData.length > 0) {
                const mergedFilters = mergeFilterHistory(filterHistoryData);
                await saveMergedFiltersToDB(userId, mergedFilters);
                filterHistoryData = []; // Reset temporary storage
            }
        } else {
            filterHistoryData.push(filterHistory);
        }

        res.status(200).json({ message: "Filter history processed successfully" });

    } catch (error) {
        console.error("Error processing filter history:", error);
        res.status(500).json({ error: "Failed to process filter history" });
    }
});

// Function to merge filter history
const mergeFilterHistory = (history) => {
    const merged = {
        colorFilters: new Set(),
        sizeFilters: new Set(),
        brandFilters: new Set(),
        minPrice: 0,
        maxPrice: 0
    };

    let latestValidPriceEntry = null;

    for (const entry of history) {
        if (
            entry.colorFilters.length === 0 &&
            entry.sizeFilters.length === 0 &&
            entry.brandFilters.length === 0 &&
            entry.minPrice === 0 &&
            entry.maxPrice === 50000
        ) {
            latestValidPriceEntry = null;
            continue;
        }

        entry.colorFilters.forEach(color => merged.colorFilters.add(color));
        entry.sizeFilters.forEach(size => merged.sizeFilters.add(size));
        entry.brandFilters.forEach(brand => merged.brandFilters.add(brand));

        latestValidPriceEntry = entry;
    }

    if (latestValidPriceEntry) {
        merged.minPrice = latestValidPriceEntry.minPrice;
        merged.maxPrice = latestValidPriceEntry.maxPrice;
    }

    return {
        colorFilters: Array.from(merged.colorFilters),
        sizeFilters: Array.from(merged.sizeFilters),
        brandFilters: Array.from(merged.brandFilters),
        minPrice: merged.minPrice,
        maxPrice: merged.maxPrice
    };
};

// Function to save merged filter data
const saveMergedFiltersToDB = async (userId, filters) => {
    try {
        const count = await Filter.countDocuments({ userId });

        if (count >= 20) {
            // Remove the oldest entry before inserting a new one
            const oldest = await Filter.findOne({ userId }).sort({ createdAt: 1 });
            if (oldest) {
                await Filter.deleteOne({ _id: oldest._id });
                await updateAggregatedFilters(userId, oldest); // Increment aggregated filters with the removed entry
            }
        }

        // Save the new filter entry
        const newFilterEntry = new Filter({ userId, ...filters });
        await newFilterEntry.save();

        console.log("Merged Filters saved to DB:", newFilterEntry);
    } catch (error) {
        console.error("Error saving merged filters:", error);
    }
};

// Function to update aggregated filters when an entry is removed
const updateAggregatedFilters = async (userId, filterEntry) => {
    try {
        let aggregated = await AggregatedFilter.findOne({ userId });

        if (!aggregated) {
            aggregated = new AggregatedFilter({ userId });
        }

        // Helper function to update filter counts
        const updateFilterMap = (map, items) => {
            for (const item of items) {
                const count = (map.get(item) || 0) + 1; // Always increment since we're keeping past data
                map.set(item, count);
            }
        };

        // Apply updates (always increment when removing from recent 20)
        updateFilterMap(aggregated.colorFilters, filterEntry.colorFilters);
        updateFilterMap(aggregated.sizeFilters, filterEntry.sizeFilters);
        updateFilterMap(aggregated.brandFilters, filterEntry.brandFilters);

        // Store historical prices for accurate median calculation
        aggregated.minPriceHistory.push(filterEntry.minPrice);
        aggregated.maxPriceHistory.push(filterEntry.maxPrice);

        // Maintain a reasonable storage size (FIFO approach if needed)
        const MAX_HISTORY = 5000;
        if (aggregated.minPriceHistory.length > MAX_HISTORY) {
            aggregated.minPriceHistory.shift();
        }
        if (aggregated.maxPriceHistory.length > MAX_HISTORY) {
            aggregated.maxPriceHistory.shift();
        }

        // Update total count
        aggregated.filterAppliedCount += 1;

        await aggregated.save();
        console.log(`Aggregated Filters updated (entry removed):`, aggregated);
    } catch (error) {
        console.error("Error updating aggregated filters:", error);
    }
};

export default router;
