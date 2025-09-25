
let server=require('http')

  let app=server.createServer((req, res)=>{
      if(req.url=="/"){
        res.write("welcome")
        res.end()
    }else if(req.url=="/home"){
        res.write("welcome to home")
        res.end()
    }else if(req.url=="/read"){
        res.write("reading")
        res.end()
    }else{
         res.write("invalid request")
        res.end()
    }

  })

  app.listen(9000,()=>{
    console.log("running")
  })