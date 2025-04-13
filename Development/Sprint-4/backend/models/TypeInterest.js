import mongoose from 'mongoose';

const typeInterestBlockSchema = new mongoose.Schema({
    blockId: { 
        type: String, 
        required: true 
    },
    gender: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    pagesClicked: {
        type: Number,
        default: 0,
    },
    productsClicked: {
        type: Number,
        default: 0,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });


const typeInterestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    typeInterests: {
        type: [typeInterestBlockSchema],
        default: [],
    },
}, { timestamps: true, minimize: true });

const TypeInterest = mongoose.model('TypeInterest', typeInterestSchema);

export default TypeInterest;
