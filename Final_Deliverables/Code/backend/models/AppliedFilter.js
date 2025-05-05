import mongoose from 'mongoose';

const singleFilterSchema = new mongoose.Schema({
    colorFilters: {
        type: [String],
        default: undefined,
    },
    sizeFilters: {
        type: [String],
        default: undefined,
    },
    brandFilters: {
        type: [String],
        default: undefined,
    },
    minPrice: {
        type: Number,
        required: true,
    },
    maxPrice: {
        type: Number,
        required: true,
    },
}, { _id: false });

const filterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    filters: {
        type: [singleFilterSchema],
        default: [],
    },
}, { timestamps: true });

const Filter = mongoose.model('Filter', filterSchema);

export default Filter;
