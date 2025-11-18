import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import multer from "multer";
import { type } from "os";
const app=express();
const PORT =4000;
const upload=multer({dest:"upload/"})
app.use(cors());
app.use(express.json());
app.use("/upload",express.static("upload"));
mongoose.connect("mongodb://localhost:27017/suba")
.then(()=>console.log("MongoDB connected"))
.catch((err)=>console.log("MongoDB not connected: ",err));
const proSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    }
  },
  {
    timestamps: true,
  }
);

const pro=mongoose.model("pro",proSchema);

const cartSchema=new mongoose.Schema(
    {
        productId:{type:mongoose.Schema.Types.ObjectId, ref:"pro"},
        title:String,
        price:Number,
        category:String,
        quantity:{type:Number, default:1},},
         {timestamps: true });
    
const cartvalue=mongoose.model("cartvalue",cartSchema)

//Add package
app.post("/api/addpackage",async(req,res)=>{
    try{
        const newPackage= new pro({
            title:req.body.title,
            price:req.body.price,
            category:req.body.category,
            image:req.file?req.file.filename:""
     } );
        await newPackage.save();
        res.json({msg:"Package added",pro:newPackage})
    }catch{
        res.json({error:"Failed"})
    }
})

app.get("/api/package",async(req,res)=>{
    try{
        const packages=await pro.find();
        res.json({packages});
    }
    catch{
        res.json({err:"Failed"});
    }
})

app.put("/api/editpackage/:id",async(req,res)=>{
    try{
        const editPackage=await pro.findByIdAndUpdate(req.params.id, req.body,{new:true})
        res.json({msg:"Package updated successfully",pro:editPackage})
    }catch(err){
        res.json({err:"Falied"});
    }
})

app.delete("/api/deletepackage/:id",async(req,res)=>{
    try{
        const deletePackage=await pro.findByIdAndDelete(req.params.id)
        res.json({msg:"Package deleted successfully"})
    }catch{
        res.json({err:"Falied"});
    }
})
app.get("/api/products/category/:category", async (req, res) => {
  const products = await pro.find({ category: req.params.category });
  res.json(products);
});

//cart
app.post("/api/addcart",async(req,res)=>{
    const{productId,title,price,category}=req.body;
    try{
        const exist=await cartvalue.findOne({productId});
        if(exist){
            exist.quantity+=1;
            await exist.save();
            return(res.json({msg:"quantity added",cart:exist}))
        }
        const newcart=new cartvalue({productId,title,price,category});
        await newcart.save();
        res.json({msg:"added to cart",cart:newcart});
    }catch(err){
        res.json({err:"failed"});
    }
})

app.get("/api/getcart",async(req,res)=>{
    try{
        const getcart=await cartvalue.find();
        res.json({msg:"cart", cartvalue:getcart});
    }catch(err){
        res.json({err:"failed"})
    }
})

app.delete("/api/deletecart/:id",async(req,res)=>{
    try{
        await cartvalue.findByIdAndDelete(req.params.id);
        res.json({msg:"item removed"});
    }catch(err){
        res.json({err:"failed"})
    }
})


// ---------- Start Server ----------
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`))