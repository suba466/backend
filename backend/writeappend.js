const fs=require("fs");
fs.appendFile("test.txt","\nWelcome to Node.js file system",(err)=>{
    if(err){
        console.log("Error in appending file: ",err);
        return;
    }
    console.log("File overwritted successfully!!!")
})