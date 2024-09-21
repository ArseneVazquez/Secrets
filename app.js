//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

console.log(process.env.API_KEY);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;

userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res)=>{
    res.render("home")
});

app.get("/register", (req, res)=>{
    res.render("register")
});

app.post("/register", (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
        .then(()=>{
            res.render("secrets");
        })
        .catch((err)=>{
            console.log(err);
        });

});

app.get("/login", (req, res)=>{
    res.render("login")
});

app.post("/login", (req, res)=>{
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email: userName})
        .then((foundUser)=>{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        })
        .catch((err)=>{
            console.log(err);
        });
});





app.listen(3000, ()=>{
 console.log("Server is starting on Port 3000");
});