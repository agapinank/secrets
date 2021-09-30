const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encryp = require("mongoose-encryption");
const port = 3000;


const app= express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

//object created from mongoose schema class
const userSchema= new mongoose.Schema({
    email: String,
    password: String,
});
const secret= "Thisisourlittlesecret.";
userSchema.plugin(encrypt,{secret:secret});

const User = mongoose.model("User", userSchema);

app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/register",(req,res)=>{
    res.render("register");
});
//user creation and saves to userDB
app.post("/register",(req,res)=>{
  
    const newUser = new User({
        email: req.body.username,
        password:req.body.password
    });
    newUser.save((err)=>{
        if(err){
            console.log(err);
        }else{
            res.render("secrets")
        }
    });
});
app.post("/login",(req,res)=>{
    //check DB user credentials
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}, (err,foundUser)=>{
        if(err){
            console.log(err);
        }else{
            // if found & match to user password
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    });


});





app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});