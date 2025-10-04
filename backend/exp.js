let express=require('express')
let bd=require("body-parser")
let app=express()
app.use(bd.json())
app.use(bd.urlencoded())


app.get("/",(req,res)=>{
    res.send("welcome")
})


app.get("/home",(req,res)=>{
    res.send({msg:"welcome", data:req.query})
})

app.get("/read/:pid",(req,res)=>{
    res.send({d:"welcome",data:req.params.pid})
})


app.post("/res",(req,res)=>{
    let {name, email,password}=req.body
    res.send("welcome")
})


app.listen(9000)