const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/secrets');
const trySchema = new mongoose.Schema({
    email: String,
    password: String
}); 

const secret = "thisismylittlesecret.";
trySchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});


const item = mongoose.model("second", trySchema);

app.get("/", function (req, res) {
    res.render("home");
})

app.post("/register", function (req, res) {
    const newUser = new item({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(() => {
        res.render("secrets");
    })
        .catch((err) => {
            console.log(err);
        })

});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    item.findOne({ email : username })
        .then((foundUser) => {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
                else{
                   res.send("Wroung Password");
                }
            }
            else{
                res.send("No user found");
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

app.get("/login", function (req, res) {
    res.render("login");
})

app.get("/logout", function (req, res) {
    res.render("home");
})

app.get("/register", function (req, res) {
    res.render("register");
})

app.listen(5000, function () {
    console.log("Server Started");
})