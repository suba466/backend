const http=require("http");
const fs=require("fs");
const url=require("url");
const fstask=http.createServer((req,res)=>{
    const parsedUrl=url.parse(req.url,true);
    const pathname=parsedUrl.pathname;
    let body="";
    req.on("data",chunk=>{
        body +=chunk.toString();
    });
    req.on("end",()=>{
        
    })
})