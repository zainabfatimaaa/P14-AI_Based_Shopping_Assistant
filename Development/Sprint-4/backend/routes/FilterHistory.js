import express from 'express';
import Filter from '../models/AppliedFilter.js';
import AggregatedFilter from '../models/AggregatedFilters.js';

const router = express.Router();
let filterHistoryData = []; // Temporary buffer for filter events

// POST route for receiving filter history
router.post('/', async (req, res) => {
    try {
        const { userId, filterHistory } = req.body;
        // console.log(filterHistory);
        // console.log("Filter");

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
                filterHistoryData = []; // clear buffer
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

// Merge filter history into one set
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

// Save merged filters in nested structure
const saveMergedFiltersToDB = async (userId, filters) => {
    try {
        let userFilterDoc = await Filter.findOne({ userId });

        if (!userFilterDoc) {
            userFilterDoc = new Filter({ userId, filters: [filters] });
        } else {
            if (userFilterDoc.filters.length >= 20) {
                const [removed] = userFilterDoc.filters.splice(0, 1); // remove oldest
                await updateAggregatedFilters(userId, removed);
            }
            userFilterDoc.filters.push(filters); // append new
        }

        await userFilterDoc.save();
        console.log("Merged Filters saved to DB:", userFilterDoc);
    } catch (error) {
        console.error("Error saving merged filters:", error);
    }
};

// Update aggregated filters when an old filter is removed
const updateAggregatedFilters = async (userId, filterEntry) => {
    try {
        let aggregated = await AggregatedFilter.findOne({ userId });

        if (!aggregated) {
            aggregated = new AggregatedFilter({ userId });
        }

        const updateFilterMap = (map, items) => {
            for (const item of items) {
                const count = (map.get(item) || 0) + 1;
                map.set(item, count);
            }
        };

        updateFilterMap(aggregated.colorFilters, filterEntry.colorFilters);
        updateFilterMap(aggregated.sizeFilters, filterEntry.sizeFilters);
        updateFilterMap(aggregated.brandFilters, filterEntry.brandFilters);

        aggregated.minPriceHistory.push(filterEntry.minPrice);
        aggregated.maxPriceHistory.push(filterEntry.maxPrice);

        const MAX_HISTORY = 5000;
        if (aggregated.minPriceHistory.length > MAX_HISTORY) aggregated.minPriceHistory.shift();
        if (aggregated.maxPriceHistory.length > MAX_HISTORY) aggregated.maxPriceHistory.shift();

        aggregated.filterAppliedCount += 1;

        await aggregated.save();
        console.log(`Aggregated Filters updated (entry removed):`, aggregated);
    } catch (error) {
        console.error("Error updating aggregated filters:", error);
    }
};

export default router;
