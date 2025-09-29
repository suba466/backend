let http=require('http')
const users=[
    { id: 1, name: 'Thendral' },
    { id: 2, name: 'Ammu' }
];
let app=http.createServer((req,res)=>{
    res.writeHead(200,{'content-type':'application/json'})
    if(req.url=="/"){
        res.end(JSON.stringify({message:"Welcome to API"}))
    }else if(req.url=='/users'){
        res.end(JSON.stringify({message:{users}}))
    }else if(req.url.startsWith("/user/")){
        const id=parseInt(req.url.split("/")[2]);
        const user=users.find(u=>u.id==id);
        if(user){
            res.end(JSON.stringify(user));
        }else{
            res.end(JSON.stringify({ error: "User not found" }));
        }
    }else {
        res.end(JSON.stringify({ error: "Invalid request" }));
    }
});
app.listen(1430, () => {
  console.log("Server running at http://localhost:1430");
});