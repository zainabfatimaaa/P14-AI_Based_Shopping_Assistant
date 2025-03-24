import mongoose from 'mongoose';

const filterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, 
    },
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
}, { timestamps: true, minimize: true });

const Filter = mongoose.model('Filter', filterSchema);

export default Filter;
