const mongoose = require('mongoose');

// Helper function to generate random order ID
function generateOrderId() {
    return 'order_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Helper function to generate random OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

const sampleOrders = [
  {
    "kathiOrders": {
      "orders": [
        {
          "orderId": generateOrderId(), // Add unique orderId
          "username": "john_doe",
          "items": [
            {
              "name": "Kathi Roll",
              "quantity": 2,
              "price": 150
            },
            {
              "name": "Paneer Wrap",
              "quantity": 1,
              "price": 120
            }
          ],
          "totalPrice": 420,
          "createdAt": "2024-10-12T09:30:00Z",
          "completed": false, // Initialize completed field
          "otp": generateOtp() // Add OTP
        },
        {
          "orderId": generateOrderId(), // Add unique orderId
          "username": "jane_smith",
          "items": [
            {
              "name": "Chicken Kathi",
              "quantity": 3,
              "price": 180
            }
          ],
          "totalPrice": 540,
          "createdAt": "2024-10-12T10:15:00Z",
          "completed": false, // Initialize completed field
          "otp": generateOtp() // Add OTP
        }
      ]
    },
    "quenchOrders": {
      "orders": [
        {
          "orderId": generateOrderId(), // Add unique orderId
          "username": "alex_miller",
          "items": [
            {
              "name": "Mango Smoothie",
              "quantity": 2,
              "price": 80
            },
            {
              "name": "Cold Coffee",
              "quantity": 1,
              "price": 70
            }
          ],
          "totalPrice": 230,
          "createdAt": "2024-10-12T11:00:00Z",
          "completed": false, // Initialize completed field
          "otp": generateOtp() // Add OTP
        }
      ]
    },
    "southernOrders": {
      "orders": [
        {
          "orderId": generateOrderId(), // Add unique orderId
          "username": "sam_lee",
          "items": [
            {
              "name": "Dosa",
              "quantity": 2,
              "price": 90
            },
            {
              "name": "Idli",
              "quantity": 4,
              "price": 50
            }
          ],
          "totalPrice": 380,
          "createdAt": "2024-10-12T12:45:00Z",
          "completed": false, // Initialize completed field
          "otp": generateOtp() // Add OTP
        }
      ]
    },
    "hotspotOrders": {
      "orders": [
        {
          "orderId": generateOrderId(), // Add unique orderId
          "username": "linda_brown",
          "items": [
            {
              "name": "Burger",
              "quantity": 1,
              "price": 150
            },
            {
              "name": "Fries",
              "quantity": 1,
              "price": 80
            }
          ],
          "totalPrice": 230,
          "createdAt": "2024-10-12T13:30:00Z",
          "completed": false, // Initialize completed field
          "otp": generateOtp() // Add OTP
        }
      ]
    }
  }
];

module.exports = { data: sampleOrders };
