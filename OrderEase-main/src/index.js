const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const collection = require('./config')
const PORT = 3000;

const app = express();

// converting data into JSON
app.use(express.json());

app.use(express.urlencoded({extended: false}));

// PATHING
app.use(express.static('public'));
app.use(express.static('assets'));

// USING EJS
app.set('view engine','ejs');

// setting path
app.get ("/", (req,res) => {
    res.render("login");
})

app.get ("/home", (req,res) => {
    res.render("mainmenu");
})

app.get ("/kathi", (req,res) => {
    res.render("kathi");
})

app.get ("/hotspot", (req,res) => {
    res.render("hotspot");
})

app.get ("/quench", (req,res) => {
    res.render("quench");
})

app.get ("/m-block", (req,res) => {
    res.render("m-block");
})

app.get ("/stories", (req,res) => {
    res.render("stories");
})

// pathing for checkouts
app.get ("/stories/storiescheck", (req,res) => {
    res.render("storiescheck");
})
app.get ("/kathi/kathicheck", (req,res) => {
    res.render("kathicheck");
})
app.get ("/quench/quenchcheck", (req,res) => {
    res.render("quenchcheck");
})
app.get ("/m-block/m-blockcheck", (req,res) => {
    res.render("m-blockcheck");
})
app.get ("/hotspot/hotspotcheck", (req,res) => {
    res.render("hotspotcheck");
})


app.post("/signup", async (req,res) => {
    const data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    // checking for existing user
    const existingUser = await collection.findOne({username: data.username});


    if(existingUser) {
        res.send("User already exist Try a different user name")
    }else {
        // hashing password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        // replace the hashed password
        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }

});

// user login 
app.post("/login", async (req,res) => {
   try{
    const check = await collection.findOne({username: req.body.username}); 
        if(!check){
            res.send("user name cannot be found");
        }

        // comparing hashed password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)
       
        if(isPasswordMatch){
            res.render("mainmenu")
            
        }else {
            req.send("Wrong password");
    }
   }catch{
    res.send("wrong details");
   } 
});


app.listen(PORT, ()=> {
    console.log(`Server is running on 
                    http://localhost:${PORT}`)
})
