const fs=require("fs");
fs.open("test.txt","a+",(err,fd)=>{
    if(err)throw err;
    const content="\nHello using fs.open!";
    fs.write(fd,content,(err,written,string)=>{
        if(err) throw err;
        console.log(written+" bytes add to file");
        fs.close(fd,(err)=>{
            if(err) throw err;
            console.log("File closed successfully!!!")
        });
    });
});