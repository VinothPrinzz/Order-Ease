const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    gmail: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        expires: '10m'
    },
    resetPasswordOtp: String,
    resetPasswordExpires: Date,
    kathiCartItems: [
        {
            itemId: String,
            itemName: String,
            quantity: Number,
            price: Number,
            image: String
        }
    ],
    kathiOrderedItems:[
        {
            itemId: String,
            itemName: String,
            quantity: Number,
            price: Number,
            image:String,
            createdAt: {
                type: Date,
                default: Date.now
            },
            completedAt: {
                type: Date
            }
        }
    ],
    southernCartItems: [
        {
            itemId: String,
            itemName: String,
            quantity: Number,
            price: Number,
            image: String
        }
    ],
    southernOrderedItems:[
        {
            itemId: String,
            itemName: String,
            quantity: Number,
            price: Number,
            image:String,
            createdAt: {
                type: Date,
                default: Date.now
            },
            completedAt: {
                type: Date
            }
        }
    ],
    quenchCartItems: [
        {
            itemId: String,
            itemName: String,
            quantity: Number,
            price: Number,
            image: String
        }
    ],
    quenchOrderedItems:[
        {
            itemId: String,
            itemName: String,
            quantity: Number,
            price: Number,
            image:String,
            createdAt: {
                type: Date,
                default: Date.now
            },
            completedAt: {
                type: Date
            }
        }
    ],
    hotspotCartItems: [
        {
            itemId: String,
            itemName: String,
            quantity: Number,
            price: Number,
            image: String
        }
    ],
    hotspotOrderedItems:[
        {
            itemId: String,
            itemName: String,
            quantity: Number,
            price: Number,
            image:String,
            createdAt: {
                type: Date,
                default: Date.now
            },
            completedAt: {
                type: Date
            }
        }
    ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
