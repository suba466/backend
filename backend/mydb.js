let exp=require('express')
let xb=require('mongoose')
let bd=require('body-parser')
let app=exp()
app.use(bd.urlencoded())
app.use(bd.json())
xb.connect("mongodb://localhost:27017/suba")
.then(()=>{console.log("connect")})
.catch((e)=>{console.log(e)})

let userschema=xb.Schema({
    name:{type:String, unique:false, trim:true},
    phone:{type:String, unique:true, trim:true},
})

let mod=xb.model("users", userschema)

app.post("/reg",async(req, res)=>{
    let {name, phone}=req.body
   await mod.create({name, phone})
    res.send("register success")
})
app.listen(9000)