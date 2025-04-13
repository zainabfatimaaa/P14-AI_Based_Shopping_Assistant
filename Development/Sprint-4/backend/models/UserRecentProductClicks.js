import mongoose from 'mongoose';

const clickedProductSchema = new mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,
    price: Number,
    sizes: [String],
    type: String,
    gender: String,
    filtercolor: String,
    brand: String,
    redirected: { type: Boolean, default: false },
    visitCount: { type: Number, default: 1 },
    clickedAt: Date,
}, { _id: false });

const userRecentProductClicksSchema = new mongoose.Schema({
    userId: String,
    clickedProducts: [clickedProductSchema]
});

export default mongoose.model('UserRecentProductClicks', userRecentProductClicksSchema);
