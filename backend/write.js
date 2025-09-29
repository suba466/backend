var fs=require("fs");
fs.writeFile("test.txt","Hii Everyone!!","utf8",(err)=>{
    if(err){
        console.log("Error in writing file: ",err);
        return;
    }
    console.log("File created...")
})