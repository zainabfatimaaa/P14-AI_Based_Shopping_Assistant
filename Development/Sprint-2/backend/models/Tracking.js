import mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: false, 
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true,
    },
    totalClicks: {
        type: Number,
        default: 0, 
    },
    totalViewTime: {
        type: Number, 
        default: 0,
    },
    wishlistCount: {
        type: Number,
        default: 0, 
    },
    redirectionClickCount: {
        type: Number,
        default: 0, 
    },
    visitCount: {
        type: Number,
        default: 0, 
    },
    lastInteraction: {
        type: Date,
        default: Date.now, 
    },
}, { timestamps: true });

const Tracking = mongoose.model('Tracking', trackingSchema);

export default Tracking;
