const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid'); // Import uuid for unique IDs
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    kathiOrders: {
        orders: [{
            orderId: {
                type: String,
                default: uuidv4,
            },
            username: {
                type: String
            },
            items: [{
                name: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }],
            totalPrice: {
                type: Number,
                required: true,
                min: 0
            },
            completed: {
                type: Boolean,
                default: false
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            otp: {
                type: String // New field for OTP
            },
            completedAt: {
                type: Date // New field for completion timestamp
            }
        }]
    },
    quenchOrders: {
        orders: [{
            orderId: {
                type: String,
                default: uuidv4,
            },
            username: {
                type: String
            },
            items: [{
                name: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }],
            totalPrice: {
                type: Number,
                required: true,
                min: 0
            },
            completed: {
                type: Boolean,
                default: false
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            otp: {
                type: String
            },
            completedAt: {
                type: Date
            }
        }]
    },
    southernOrders: {
        orders: [{
            orderId: {
                type: String,
                default: uuidv4,
            },
            username: {
                type: String
            },
            items: [{
                name: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }],
            totalPrice: {
                type: Number,
                required: true,
                min: 0
            },
            completed: {
                type: Boolean,
                default: false
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            otp: {
                type: String
            },
            completedAt: {
                type: Date
            }
        }]
    },
    hotspotOrders: {
        orders: [{
            orderId: {
                type: String,
                default: uuidv4,
            },
            username: {
                type: String
            },
            items: [{
                name: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }],
            totalPrice: {
                type: Number,
                required: true,
                min: 0
            },
            completed: {
                type: Boolean,
                default: false
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            otp: {
                type: String
            },
            completedAt: {
                type: Date
            }
        }]
    }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
