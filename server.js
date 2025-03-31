//Importing all required external modules

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./Models/User');
const app = express();
const bcrypt = require('bcryptjs');
app.use(express.json());
const port=3000;

//Connection to database Atlas
mongoose.connect(process.env.MONGO_URL).then(
    ()=>console.log("Connected to MongoDB Atlas")
).catch((err)=>console.log(err));

//API Landing Page
app.get("/",async(req,res)=>{
    try {
        res.send("<h2 style='text-align:center'>Welcome to the Backend API<h2>");   
    } catch (err) {
        console.log(err);
    }
});

//API For Register Page
app.post("/register",async(req,res)=>{
    const {username,email,password}=req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username,email,password:hashedPassword});
        await newUser.save();
        res.json({message:"User registered successfully"});
        console.log("User registered successfully");
    } catch (err) {
        console.log(err);
    }
});

//API For Login Page
app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user = await User.findOne({email});
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(400).json({message:"User not found"});
        }
        res.json({message:"User logged in successfully", username:user.username});
        console.log("User logged in successfully");
    } catch (err) {
        console.log(err);
    }
});

//Server Connection and testing
app.listen(port,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("Server is running on port :"+port);
});