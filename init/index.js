const mongoose = require("mongoose");
const initData = require("./southern.js");
const food = require("../models/food.js");

// const MONGO_URL_kathi = "mongodb://127.0.0.1:27017/kathi";
// const MONGO_URL_quench = "mongodb://127.0.0.1:27017/quench";
// const MONGO_URL_hotspot = "mongodb://127.0.0.1:27017/hotspot";
const MONGO_URL_southern = "mongodb://127.0.0.1:27017/southern";
// const MONGO_URL_users = "mongodb://127.0.0.1:27017/user";
// const MONGO_URL_orders = "mongodb://127.0.0.1:27017/order";

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    // await mongoose.connect(MONGO_URL_kathi);
    // await mongoose.connect(MONGO_URL_quench);
    // await mongoose.connect(MONGO_URL_hotspot);
    await mongoose.connect(MONGO_URL_southern);
    // await mongoose.connect(MONGO_URL_users);
    // await mongoose.connect(MONGO_URL_orders);
    

}

const initDB = async () => {
    await food.deleteMany({});
    await food.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();