import mongoose from 'mongoose';

const aggregatedFilterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, 
    },
    colorFilters: {
        type: Map,
        of: Number,
        default: {},
    },
    sizeFilters: {
        type: Map,
        of: Number,
        default: {},
    },
    brandFilters: {
        type: Map,
        of: Number,
        default: {},
    },

    // Store historical price ranges to calculate median values dynamically
    minPriceHistory: {
        type: [Number], 
        default: [],
    },
    maxPriceHistory: {
        type: [Number], 
        default: [],
    },

    filterAppliedCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true, minimize: false });

const AggregatedFilter = mongoose.model('AggregatedFilter', aggregatedFilterSchema);

export default AggregatedFilter;
