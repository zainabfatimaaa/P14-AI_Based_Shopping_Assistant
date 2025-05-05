import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const wishlistItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    product: String,
    price: Number,
    primary_color: String,
    filtercolor: String,
    type: String,
    gender: String,
    images: [String],
    brand: String,
    message: String
  });

const accountSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    wishlist: [wishlistItemSchema],
    browsingHistory: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
    }], 

    purchaseHistory: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }], 

    searchQueries: [{ 
        type: String,
    }],
    
    // ratings: [{
    //     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    //     rating: { type: Number, min: 1, max: 5 }
    // }]
}, { timestamps: true });

accountSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
