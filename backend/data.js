const exp=require("express");
const md=require("mongoose");
const bd=require("body-parser");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");



const app=exp();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());

md.connect("mongodb://localhost:27017/suba")
.then(()=>{console.log("Mongodb connected")})
.catch((e)=>{console.log(e)})

//Userschema
let userSchema=new md.Schema({
    name:{type:String, required:true,trim:true},
    phone:{type:String, required:true,trim:true, unique:true},
    city:{type:String,trim:true},
    age:{type:Number, required:true,trim:true},
    email:{type:String, required:true,trim:true},
    password:{type:String, required:true,trim:true}
});

const User = md.model("users",userSchema);

//products
const productSchema=new md.Schema({
    userId:{type:md.Schema.Types.ObjectId, ref:"users", required:true},
    name:{type:String,required:true, trim:true},
    price:{type:Number,required:true},
    category:{type:String, trim:true},
    stock:{type:Number, default:0}
});
const Product=md.model("products",productSchema)

//Auth middleware
const authMiddleware=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({message:"No token provided"})
    try{
        const decoded=jwt.verify(token,"SECRET_KEY");
        req.user=decoded;
        next();
}catch(err){
    res.status(403).json({message:"Invalid token"})
}
};

//register
app.post("/reg",async(req,res)=>{
    try{
        const {name,phone,city,age,email,password}=req.body;
        const existing=await User.findOne({email});
        if(existing) return res.json({message:"User already exits"});
        const hashed=await bcrypt.hash(password,10);
        const user=await User.create({name,phone,city,age,email,password:hashed})
        res.json({message:"Registered successfully!!",user})
    }catch(err){
        res.json({err:err.message})
    }
});

//login
app.post("/login",async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email});
        if(!user) return res.json({message:"User not found"});

        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch) return res.json({message:"Invalid credentials"});

        const token=jwt.sign({id:user._id, email:user.email}, "SECRET_KEY",{expiresIn:"1h"});
        res.json({message:"Login successfully",token});
    }catch(err){
        res.json({err:err.message})
    }
});

//protected route
app.get("/profile",authMiddleware, async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password");
        res.json({message:"User profile",user});
    }catch(err){
        res.json({err:err.message});
    }
});


//create products
app.post("/products",authMiddleware,async(req,res)=>{
    try{
        const {name, price,category, stock}=req.body;
        const newProduct=await Product.create({userId:req.user.id, name, price, category, stock});
        res.json({message:"Product created",newProduct })
    }catch(err){
        res.json({err:err.message});
    }
});

//read
app.get("/product", async(req,res)=>{
    try{
        const product=await Product.find();
        res.json(product);
    }catch(err){
        res.json({err:err.mesaage})
    }
})

//update
app.put("/products/:id",authMiddleware,async(req,res)=>{
    try{
        const {name,price,category,stock}=req.body;
        const updatedProduct= await Product.findOneAndUpdate({_id:req.params.id,userId:req.user.id},
            {name,price,category,stock},
            {new:true, runValidators:true}
        );
        if(!updatedProduct) return res.json({error:"User not found"});
        res.json({message:"Product updated",updatedProduct})
    }catch(err){
        res.json({err:err.message});
    }
});

//delete
app.delete("/products/:id",async(req,res)=>{
    try{
        const deleted= await Product.findByIdAndDelete(req.params.id);
        if(!deleted) res.json({message:"Product not found"});
        res.json({message:"Product deleted"});
    }catch(err){
        res.json({err:err.message})
    }
})
app.listen(5000)
