import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    colors: {
        type: [String],  // Array of colors
        required: true,
    },
    sizes: {
        type: [String],  // Array of sizes
        required: true,
    },
    primary_color: {
        type: String,
        required: true,
    },
    redirect_link: {
        type: String,
        required: true,  // Link to the brand’s website
    },
    type: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    images: {
        type: [Buffer],  // Array of images stored as binary data (Buffer)
        required: true,
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
