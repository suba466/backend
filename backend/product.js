import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
const app=express();
const PORT =4000;
app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/suba")
.then(()=>console.log("MongoDB connected"))
.catch((err)=>console.log("MongoDB not connected: ",err));
const proSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});
const pro=mongoose.model("Package",proSchema);

// ---------- Start Server ----------
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`))

