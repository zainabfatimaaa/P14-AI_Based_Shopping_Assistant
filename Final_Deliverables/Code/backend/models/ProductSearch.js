import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    colors: {
        type: [String], // Array of strings
        required: true,
    },
    sizes: {
        type: [String], // Array of strings
        required: true,
    },
    primary_color: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    images: {
        type: [String], // Array of image URLs as strings
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    filtercolor: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    "Embeddings Created": {
        type: Boolean,
        required: true,
    },
    detailed_description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// const Product = mongoose.model('Product', productSchema);

const ProductData = mongoose.model('ProductData', productImageSchema);

export default ProductData;
