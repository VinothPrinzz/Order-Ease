const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true // Trims whitespace from the beginning and end
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        url: {
            type: String,
            set: (v) => v === "" 
                ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" 
                : v // Default image URL if empty
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Ensures the price is non-negative
    },
   
});

const FoodItem = mongoose.model("FoodItem", foodItemSchema);
module.exports = FoodItem;