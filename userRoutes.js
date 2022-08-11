const express = require("express");
const Bcrypt = require("bcrypt")
const jtoken= require("jsonwebtoken");
const router = new express.Router();

const User = require("./registerSchema");

//get all registered users

router.get('/users',async function(req,res){
    try{
        const users = await User.find()
        res.status(200).json({ Status:"Successfully found the registered users",
        usersList:users,})
    }
    catch(e){
        res.status(500).json({Status:"Error",
        Error:e.message,})
    }
})



router.post('/register', async (req,res)=>{
    try{
        let {firstname,last_name,email,mobile,password,role,status} = req.body

        if(!firstname||!last_name||!email||!mobile||!password||!role||!status){
            return res.status(422).json({Status:"Registration failed",
        Message:"Please fill out all the details"})
        }
        const userFound =await User.findOne({email:email})
        if(userFound){
            return res.status(300).json({message:"This email is already registered"})
        }
        const phoneFound =await User.findOne({mobile:mobile})
        if(phoneFound){
            return res.status(300).json({message:"This number is already registered"})
        }

        let salt = await Bcrypt.genSalt(10)
        hashedpassword = await Bcrypt.hash(String(req.body.password),salt)
        const uservar = new User({
            ...req.body,
            password:hashedpassword,
        })
        const savetheuser = await uservar.save()
        res.status(200).json({Status:"Successfully registered",
        userDetails:savetheuser})
    }
    catch(e){
        res.status(500).json({Status:"Error",
        Error:e.message,})
    }
})

router.post('/login', async function(req,res){
    try{
        const {email,password,role} = req.body
        if(!email || !password||!role){
            return res.status(422).json({Message:"Fill out the details"})
        }
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(404).json({Status:"Error",
            Error:"Email is not registered"})
        }
        let checkpwd = await Bcrypt.compare(String(password),user.password)

        if(!checkpwd){
            return res.status(401).json({Status:"Error",
            Error:"Invalid password. Try again"})
        }
        const tokenNow = await jtoken.sign({_id:user._id.toString()},process.env.SECRET_TOKEN,{expiresIn:"720h"})
        await user.save()
        res.json({Status:"Sucess",
        genToken:tokenNow,userDetails:user})
    }
    catch(e){
        res.status(500).json({Status:"Error",
        Error:e.message,})
    }
})

router.get("/logout",async(req,res)=>{
    try{
        let user = User.findOne({mail:req.body.mail})
        let randomNumberToAppend = toString(Math.floor((Math.random() * 1000) + 1));
        let hashedRandomNumberToAppend = await Bcrypt.hash(randomNumberToAppend, 10);
    
        // now just concat the hashed random number to the end of the token
        let newtoken = user.logtoken + hashedRandomNumberToAppend ;
        await user.updateOne({$set:{logtoken:newtoken}})
        return res.status(200).json({Status:'Successfully logged out'});
    }catch(e){
        return res.status(500).json({Error:e.message});
    }
})

module.exports = router;