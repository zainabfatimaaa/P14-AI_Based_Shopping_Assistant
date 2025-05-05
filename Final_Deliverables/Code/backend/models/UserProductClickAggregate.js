import mongoose from 'mongoose';

const userProductClickAggregateSchema = new mongoose.Schema({
    userId: String,
    aggregateData: {
        brandCounts: { type: Map, of: Number, default: {} },
        sizeCounts: { type: Map, of: Number, default: {} },
        typeCounts: { type: Map, of: Number, default: {} },
        genderCounts: { type: Map, of: Number, default: {} },
        filtercolorCounts: { type: Map, of: Number, default: {} },
        priceHistory: [Number],
    }
});

export default mongoose.model('UserProductClickAggregate', userProductClickAggregateSchema);
