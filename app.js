require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const FoodItem = require("./models/food");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const nodemailer = require("nodemailer");
const generateOtp = require('./init/otp');
const Order = require("./models/Order");
const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');
const flash = require("flash");

const app = express();
const port = process.env.PORT || 8080;

const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: "mysupersecretcode"
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{
    console.log("Error in Mongo session Store", error);
});

const sessionOptions={
    store,
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,

    },
};

const MONGO_URLS = {
    kathi: `${process.env.ATLASDB_URL}/kathi`,
    quench: `${process.env.ATLASDB_URL}/quench`,
    southern: `${process.env.ATLASDB_URL}/southern`,
    hotspot: `${process.env.ATLASDB_URL}/hotspot`,
    user: `${process.env.ATLASDB_URL}/user`,
    orders: `${process.env.ATLASDB_URL}/order`
};

let connections = {};

async function connectToDatabase(url) {
    return mongoose.createConnection(url);
}

async function main() {
    for (const [key, url] of Object.entries(MONGO_URLS)) {
        connections[key] = await connectToDatabase(url);
        if (key !== 'user') {
            connections[key].model("FoodItem", FoodItem.schema);
        }
    }
    connections.user.model("User", User.schema);
    connections.orders = await connectToDatabase(MONGO_URLS.orders);
    connections.orders.model("Order", Order.schema);
    console.log("Connected to all databases");
}

main().catch(err => console.log(err));
app.use(session(sessionOptions));
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.listen(port, () => {
    console.log("Server is listening on port " + port);
});

//Payment session

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.get("/",(req,res)=>{
    res.redirect("/home");
})


// new routes for Razorpay integration
app.get("/product", async (req, res) => {
    try {
        res.render('product');
    } catch (error) {
        console.log(error.message);
        res.status(500).send("An error occurred");
    }
});


app.post("/create-order", async (req, res) => {
    try {
        const amount = req.body.amount * 100;
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'sathvikkomuravelly@gmail.com'
        };

        razorpayInstance.orders.create(options, (err, order) => {
            if (!err) {
                res.status(200).send({
                    success: true,
                    msg: 'Order Created',
                    order_id: order.id,
                    amount: amount,
                    key_id: process.env.RAZORPAY_KEY_ID,
                    product_name: req.body.name,
                    description: req.body.description,
                    contact: "8688460479",
                    name: "Bennett Foods",
                    email: "sathvikkomuravelly@gmail.com"
                });
            } else {
                res.status(400).send({success: false, msg: 'Something went wrong!'});
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("An error occurred");
    }
});


// Email transporter setup
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

const adminCredentials = {
    kathi: { username: process.env.ADMIN_KATHI_USERNAME, password: process.env.ADMIN_KATHI_PASSWORD },
    quench: { username: process.env.ADMIN_QUENCH_USERNAME, password: process.env.ADMIN_QUENCH_PASSWORD },
    southern: { username: process.env.ADMIN_SOUTHERN_USERNAME, password: process.env.ADMIN_SOUTHERN_PASSWORD },
    hotspot: { username: process.env.ADMIN_HOTSPOT_USERNAME, password: process.env.ADMIN_HOTSPOT_PASSWORD }
};


app.get("/admin-login", (req, res) => {
    res.render("admin-login", { error: null });
});

app.post("/admin-login", (req, res) => {
    const { username, password } = req.body;
    
    for (const [shop, creds] of Object.entries(adminCredentials)) {
        if (username === creds.username && password === creds.password) {
            req.session.adminShop = shop;
            return res.redirect(`/modify/${shop}`);
        }
    }
    
    res.render("admin-login", { error: "Invalid admin credentials" });
});

app.get("/admin-logout", (req, res) => {
    req.session.adminShop = null;
    res.redirect("/home");
});

app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        try {
            const UserModel = connections.user.model("User");
            const user = await UserModel.findOne({ username });
            
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    req.session.userId = user._id;
                    return res.redirect("/home");
                }
            }
            res.send("Invalid username or password");
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).render("login", { error: "An unexpected error occurred. Please try again." });
        }
    } else {
        return res.render("login", { error: "Please provide both username and password" });
    }
});

app.get('/api/get-cart', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const UserModel = connections.user.model("User");
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ cart: {
            kathiCartItems: user.kathiCartItems,
            southernCartItems: user.southernCartItems,
            quenchCartItems: user.quenchCartItems,
            hotspotCartItems: user.hotspotCartItems
        }});
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/update-cart', isAuthenticated, async (req, res) => {
    try {
        const { shopName, itemId, itemName, quantity, price, image } = req.body;
        const userId = req.session.userId;

        const UserModel = connections.user.model("User");
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const cartField = `${shopName.toLowerCase()}CartItems`;
        const itemIndex = user[cartField].findIndex(item => item.itemId === itemId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                user[cartField][itemIndex].quantity = quantity;
            } else {
                user[cartField].splice(itemIndex, 1);
            }
        } else if (quantity > 0) {
            user[cartField].push({ itemId, itemName, quantity, price, image });
        }

        await user.save();
        res.json({ message: 'Cart updated successfully', cart: user[cartField] });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/signup", (req, res) => {
    res.render("signup", { errors: [] });
});

app.get("/home/about", (req, res) => {
    res.render("about");
});

app.post("/signup", async (req, res) => {
    try {
        const { username, password, gmail } = req.body;
        const UserModel = connections.user.model("User");

        const existingUser = await UserModel.findOne({ $or: [{ username }, { gmail }] });
        if (existingUser) {
            return res.render("signup", { errors: ["Username or email already exists"] });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const otp = generateOtp();

        const newUser = new UserModel({
            username,
            password: hashedPassword,
            gmail,
            otp
        });

        await newUser.save();

        const mailOptions = {
            from: 'komuravellysathvik@gmail.com',
            to: gmail,
            subject: 'Email Verification',
            text: `Your verification code is:${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.render("signup", { errors: ["Error sending verification email"] });
            }
            console.log('Email sent: ' + info.response);
            res.render("verify", { email: gmail });
        });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            res.status(400).render("signup", { errors: errorMessages });
        } else {
            console.error("Signup error:", error);
            res.status(500).render("signup", { errors: ["An unexpected error occurred. Please try again."] });
        }
    }
});

app.post("/verify", async (req, res) => {
    const { email, otp } = req.body;
    const UserModel = connections.user.model("User");

    try {
        const user = await UserModel.findOne({ gmail: email, otp: otp });
        if (user) {
            user.isVerified = true;
            user.otp = undefined;
            await user.save();
            req.session.userId = user._id;
            res.redirect("/home");
        } else {
            res.render("verify", { email, error: "Invalid OTP" });
        }
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).render("verify", { email, error: "An unexpected error occurred. Please try again." });
    }
});

//forgot password
app.get("/forgot-password", (req, res) => {
    res.render("forgot-password", { error: null });
});

app.post("/forgot-password", async (req, res) => {
    const { gmail } = req.body;
    const UserModel = connections.user.model("User");

    try {
        const user = await UserModel.findOne({ gmail });
        if (!user) {
            return res.render("forgot-password", { error: "Email not found" });
        }

        const otp = generateOtp();
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 600000; // OTP expires in 10 minutes
        await user.save();

        const mailOptions = {
            from: 'komuravellysathvik@gmail.com',
            to: gmail,
            subject: 'Password Reset',
            text: `Your password reset code is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.render("forgot-password", { error: "Error sending reset email" });
            }
            console.log('Email sent: ' + info.response);
            res.render("reset-password", { email: gmail, error: null });
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).render("forgot-password", { error: "An unexpected error occurred. Please try again." });
    }
});

app.post("/reset-password", async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const UserModel = connections.user.model("User");

    try {
        const user = await UserModel.findOne({
            gmail: email,
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.render("reset-password", { email, error: "Invalid or expired OTP" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.redirect("/login");
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).render("reset-password", { email, error: "An unexpected error occurred. Please try again." });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        res.redirect("/home");
    });
});

app.get("/home", async (req, res) => {
    try {
        let username = null;
        let isLoggedIn = false;
        if (req.session && req.session.userId) {
            const UserModel = connections.user.model("User");
            const user = await UserModel.findById(req.session.userId);
            if (user) {
                username = user.username;
                isLoggedIn = true;
            }
        }
        res.render("home", { username: username, isLoggedIn: isLoggedIn });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.render("home", { username: null, isLoggedIn: false });
    }
});

app.get("/home/:shop", isAuthenticated, async (req, res) => {
    const { shop } = req.params;
    if (!connections[shop]) {
        return res.status(404).send("Shop not found");
    }
    const Food = connections[shop].model("FoodItem");
    const food = await Food.find({});
    res.render(shop, { food });
});

app.get("/:shop-cart", isAuthenticated, async (req, res) => {
    const { shop } = req.params;
    const UserModel = connections.user.model("User");
    const user = await UserModel.findById(req.session.userId);
    const cartItems = user[`${shop}CartItems`];
    
    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    res.render(`${shop}-cart`, { 
        cartItems, 
        totalAmount,
        razorpayKeyId: "rzp_test_NZXiFCx6PZfgtI"
    });
});

app.get("/modify/:shop", async (req, res) => {
    if (!req.session.adminShop || req.session.adminShop !== req.params.shop) {
        return res.status(403).send("Unauthorized access");
    }
    const { shop } = req.params;
    if (!connections[shop]) {
        return res.status(404).send("Shop not found");
    }
    const Food = connections[shop].model("FoodItem");
    const shopName = shop.charAt(0).toUpperCase() + shop.slice(1);

    try {
        const food = await Food.find({});
        res.render(`${shop}Modify`, { shop, shopName, food });
    } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).send("Error fetching food items");
    }
});

app.post("/modify/:shop/add", async (req, res) => {
    const { shop } = req.params;
    const { name, description, image, price } = req.body;
    if (!connections[shop]) {
        return res.status(404).send("Shop not found");
    }
    const Food = connections[shop].model("FoodItem");
    try {
        const newItem = new Food({ 
            name, 
            description, 
            image: { url: image || undefined }, 
            price: parseFloat(price)
        });
        await newItem.save();
        res.redirect(`/modify/${shop}`);
    } catch (error) {
        console.error("Error adding new item:", error);
        res.status(500).send("Error adding new item: " + error.message);
    }
});

app.post("/modify/:shop/update/:id", async (req, res) => {
    const { shop, id } = req.params;
    const { name, description, image, price } = req.body;
    if (!connections[shop]) {
        return res.status(404).send("Shop not found");
    }
    const Food = connections[shop].model("FoodItem");
    try {
        await Food.findByIdAndUpdate(id, { 
            name, 
            description, 
            image: { url: image || undefined }, 
            price: parseFloat(price)
        }, { runValidators: true });
        res.redirect(`/modify/${shop}`);
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).send("Error updating item: " + error.message);
    }
});

app.post("/modify/:shop/delete/:id", async (req, res) => {
    const { shop, id } = req.params;
    if (!connections[shop]) {
        return res.status(404).send("Shop not found");
    }
    const Food = connections[shop].model("FoodItem");
    try {
        await Food.findByIdAndDelete(id);
        res.redirect(`/modify/${shop}`);
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).send("Error deleting item: " + error.message);
    }
});

app.get("/home/profile", (req, res) => {
    res.render("profile");
});

app.get("/:shop-dashboard", async (req, res) => {
    const { shop } = req.params;
    if (!['kathi', 'quench', 'southern', 'hotspot'].includes(shop)) {
        return res.status(404).send("Shop not found");
    }
    if (!req.session.adminShop || req.session.adminShop !== shop) {
        return res.status(403).send("Unauthorized access");
    }
    try {
        const OrderModel = connections.orders.model("Order");
        const orders = await OrderModel.findOne({}, `${shop}Orders`);
        const activeOrders = orders[`${shop}Orders`].orders.filter(order => !order.completed);
        const completedOrders = orders[`${shop}Orders`].orders.filter(order => order.completed);
        res.render("shopDashboard", { shop, activeOrders, completedOrders });
    } catch (error) {
        console.error(`Error fetching ${shop} orders:`, error);
        res.status(500).send(`Error fetching ${shop} orders`);
    }
});

app.post("/:shop-dashboard/order-ready/:orderId", async (req, res) => {
    const { shop, orderId } = req.params;
    try {
        const OrderModel = connections.orders.model("Order");
        const UserModel = connections.user.model("User");

        const order = await OrderModel.findOne({ [`${shop}Orders.orders`]: { $elemMatch: { orderId: orderId } } });        
        if (!order) {
            return res.status(404).send("Order not found");
        }

        const orderDetails = order[`${shop}Orders`].orders.find(o => o.orderId === orderId);
        const user = await UserModel.findOne({ username: orderDetails.username });

        if (!user || !user.gmail) {
            return res.status(400).send("User email not found");
        }

       
        const mailOptions = {
            from: 'komuravellysathvik@gmail.com',
            to: user.gmail,
            subject: `Your ${shop.charAt(0).toUpperCase() + shop.slice(1)} order is ready!`,
            text: `Your order (ID: ${orderId}) is ready for pickup. Please come to collect it!`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send("Notification sent successfully");
    } catch (error) {
        console.error("Error sending ready notification:", error);
        res.status(500).send("Error sending notification");
    }
});


app.post('/:shop-dashboard/generate-otp/:orderId', async (req, res) => {
    const { shop, orderId } = req.params;
    try {
        const OrderModel = connections.orders.model("Order");
        const UserModel = connections.user.model("User");
        
        const order = await OrderModel.findOne({ [`${shop}Orders.orders`]: { $elemMatch: { orderId: orderId } } });
        
        if (!order) {
            return res.status(404).send("Order not found");
        }

        const orderDetails = order[`${shop}Orders`].orders.find(o => o.orderId === orderId);
        
        const user = await UserModel.findOne({ username: orderDetails.username });
        
        if (!user || !user.gmail) {
            return res.status(400).send("User email not found");
        }

        const otp = generateOtp();
        
        orderDetails.otp = otp;
        await order.save();

        const mailOptions = {
            from: 'komuravellysathvik@gmail.com',
            to: user.gmail,
            subject: `OTP for your ${shop.charAt(0).toUpperCase() + shop.slice(1)} order pickup`,
            text: `Your OTP for order pickup (ID: ${orderId}) is: ${otp}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send("OTP sent successfully");
    } catch (error) {
        console.error("Error generating and sending OTP:", error);
        res.status(500).send(`Error generating and sending OTP: ${error.message}`);
    }
});

app.post('/:shop-dashboard/verify-otp/:orderId', async (req, res) => {
    const { shop, orderId } = req.params;
    const { otp } = req.body;
    try {
        const OrderModel = connections.orders.model("Order");
        const UserModel = connections.user.model("User");
        
        const order = await OrderModel.findOne({ [`${shop}Orders.orders`]: { $elemMatch: { orderId: orderId } } });
        
        if (!order) {
            return res.status(404).send("Order not found");
        }

        const orderIndex = order[`${shop}Orders`].orders.findIndex(o => o.orderId === orderId);
        
        if (orderIndex === -1) {
            return res.status(404).send("Order not found");
        }

        const orderDetails = order[`${shop}Orders`].orders[orderIndex];
        
        if (orderDetails.otp && orderDetails.otp === otp) {
            orderDetails.completed = true;
            orderDetails.otp = undefined;
            orderDetails.completedAt = new Date();
            
            order[`${shop}Orders`].orders.push(order[`${shop}Orders`].orders.splice(orderIndex, 1)[0]);
            
            await order.save();

            // Add ordered items to user's profile
            const user = await UserModel.findOne({ username: orderDetails.username });
            if (user) {
                orderDetails.items.forEach(item => {
                    user[`${shop}OrderedItems`].push({
                        itemId: item._id,
                        itemName: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.image,
                        createdAt: orderDetails.createdAt,
                        completedAt: orderDetails.completedAt
                    });
                });
                await user.save();
            }

            res.status(200).send("OTP verified successfully. Order marked as completed and added to user profile.");
        } else {
            res.status(400).send("Invalid OTP");
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).send("Error verifying OTP");
    }
});

app.get('/api/:shop/completed-orders', async (req, res) => {
    const { shop } = req.params;
    try {
        const OrderModel = connections.orders.model("Order");
        const orders = await OrderModel.findOne({}, `${shop}Orders`);
        const completedOrders = orders[`${shop}Orders`].orders.filter(order => order.completed);
        res.json(completedOrders);
    } catch (error) {
        console.error(`Error fetching completed ${shop} orders:`, error);
        res.status(500).json({ error: `Error fetching completed ${shop} orders` });
    }
});

app.post('/api/:shop/create-order', isAuthenticated, async (req, res) => {
    const { shop } = req.params;
    try {
        const { items, totalPrice } = req.body;
        const UserModel = connections.user.model("User");
        const OrderModel = connections.orders.model("Order");

        const user = await UserModel.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.gmail) {
            return res.status(400).json({ error: 'User email not found. Please update your profile with a valid email address.' });
        }

        let order = await OrderModel.findOne({});
        if (!order) {
            order = new OrderModel({});
        }

        const newOrder = {
            orderId: uuidv4(),
            username: user.username,
            items: items,
            totalPrice: totalPrice,
            completed: false,
            createdAt: new Date()
        };

        order[`${shop}Orders`].orders.push(newOrder);
        await order.save();

        res.status(201).json({ message: 'Order created successfully', orderId: newOrder.orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

app.post('/api/:shop/clear-cart', isAuthenticated, async (req, res) => {
    const { shop } = req.params;
    try {
        const UserModel = connections.user.model("User");
        const user = await UserModel.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user[`${shop}CartItems`] = [];
        await user.save();

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

app.get("/profile", async (req, res) => {
    try {
        const UserModel = connections.user.model("User");
        const user = await UserModel.findById(req.session.userId);
        
        if (!user) {
            return res.status(404).send("User not found");
        }

        const shops = ['kathi', 'southern', 'quench', 'hotspot'];
        const orderedItems = {};

        shops.forEach(shop => {
            orderedItems[shop] = user[`${shop}OrderedItems`];
        });

        res.render("profile", { user, orderedItems });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send("Error fetching user profile");
    }
});