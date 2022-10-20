const router = require("express").Router();

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const {verifyToken, verifyTokenAndAutherization,verifyTokenAndAdmin} = require("./verifyToken");

//CREATE

router.post("/",verifyToken ,async (req,res) => {
    const newCart = new Cart(req.body);

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }catch(err){
        res.status(500).json(err);
    }
})

//UPDATE
router.put("/:id",verifyTokenAndAutherization ,async (req,res)=>{
    try{
        const updateCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {new: true}
        );
        res.status(200).json(updateCart);
    }catch(err){
        res.status(500).json(err)
    }
});

//DELETE

router.delete("/:id",verifyTokenAndAutherization , async (req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart is deleted...")
    }catch(err){
        res.status(500).json(err); 
    }
});

//GET USER CART

router.get("/find/:userId",verifyTokenAndAutherization, async (req,res)=>{
    try{
        const cart = await Cart.findOne({userId : require.params.userId})

        res.status(201).json(cart)
      
    }catch(err){
        res.status(500).json(err); 
    }
});

// //GET ALL PRODUCTS

router.get("/",verifyTokenAndAdmin,async (req,res)=>{
    try{
        const carts = await carts.find();
        res.status(200).json(carts)
    }catch(err){
        res.status(500).json(err)
    }
})



module.exports = router