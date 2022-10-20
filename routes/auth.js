const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");

//REGISTER

router.post("/register",async(req,res)=>{
    const newUser = new User({
        username:req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
                    req.body.password, 
                    process.env.KEY_SECRET)
                    .toString(),
    });
    try{
        const savedUser = await newUser.save();
        console.log(savedUser);
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

//LOGIN

router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({username:req.body.username});
        !user && res.status(401).json("wrong credential");

        const hashPassword = CryptoJS.AES.decrypt(
            user.password, 
            process.env.KEY_SECRET
            );
        const originalPassword = hashPassword.toString(CryptoJS.enc.Utf8);  

        originalPassword !== req.body.password && res.status(401).json("wrong credential");
        const { password, ...others} = user._doc;
        
        const accessToken = JWT.sign(
            {
                id:user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            {expiresIn:"3d"}
        )        
        res.status(201).json({...others, accessToken})
        
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router