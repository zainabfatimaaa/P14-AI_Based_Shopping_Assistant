import mongoose from 'mongoose';
import Product from './models/Products.js';
import dotenv from 'dotenv';

dotenv.config();

const dummyProducts = [
    {
        name: "Traditional Kurta",
        price: 1500,
        brand: "Brand A",
        category: "Men's Clothing",
        image: "/images/products/kurta1.jpg",
        link: "https://brand-a.com/product/kurta1"
    },
    {
        name: "Embroidered Shalwar Kameez",
        price: 2500,
        brand: "Brand B",
        category: "Women's Clothing",
        image: "/images/products/shalwar_kameez1.jpg",
        link: "https://brand-b.com/product/shalwar_kameez1"
    },
    {
        name: "Leather Sandals",
        price: 1200,
        brand: "Brand C",
        category: "Footwear",
        image: "/images/products/sandals1.jpg",
        link: "https://brand-c.com/product/sandals1"
    },
    {
        name: "Casual Denim Jeans",
        price: 1800,
        brand: "Brand D",
        category: "Men's Clothing",
        image: "/images/products/jeans1.jpg",
        link: "https://brand-d.com/product/jeans1"
    },
    {
        name: "Silk Scarf",
        price: 800,
        brand: "Brand E",
        category: "Accessories",
        image: "/images/products/scarf1.jpg",
        link: "https://brand-e.com/product/scarf1"
    },
    {
        name: "Formal Blazer",
        price: 4000,
        brand: "Brand F",
        category: "Men's Clothing",
        image: "/images/products/blazer1.jpg",
        link: "https://brand-f.com/product/blazer1"
    }
];



async function populateProducts() {

    await Product.deleteMany({});  // Clears existing products if you want to reset
    await Product.insertMany(dummyProducts);

    console.log("Database populated with dummy products");
}

populateProducts();
