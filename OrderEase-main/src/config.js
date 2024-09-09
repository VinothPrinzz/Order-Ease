const mongoose = require('mongoose')
const connect = mongoose.connect('mongodb://localhost:27017/dtiProject')

// checking connection
connect.then(() => {
    console.log("connection successfull")
})
.catch(() => {
    console.log("Connection failed")
})

// creating schema
const Loginschema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

// creation of collection
const collection = new mongoose.model("loginData", Loginschema);

module.exports = collection;