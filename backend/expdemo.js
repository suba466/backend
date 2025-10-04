let express=require("express");
let bd=require("body-parser");
let app=express()
app.use(bd.json());
app.use(bd.urlencoded());

app.get("/",(req,res)=>{
    res.send("Hii everyone!!, Welcome to Express practice")
})

app.get("/home",(req,res)=>{
    res.send({msg:"Products data received!!", data:req.query});
})

app.get("/section/:id",(req,res)=>{
    res.send({d:"Products fetched!", data:req.params.id});
})

app.post("/register",(req,res)=>{
    console.log("hit");
    
    let{name,email}=req.body;
    res.send({msg:"registerd successfully", name, email})
})

app.post("/login",(req,res)=>{ 
    let{username,password}=req.body;
    if(username=="admin"&&password=="1234"){
        res.send({msg:"Login successfullly"})
    }
    else {
        res.send({msg:"Login falied"})
    }
})

app.put("/update/:id", (req, res) => {
    res.send({ msg: "Data updated", id: req.params.id, newData: req.body })
})

app.delete("/delete/:id",(req,res)=>{
    res.send({ msg: "Deleted", id: req.params.id })
})
app.listen(1430,()=>{
    console.log("running")
})