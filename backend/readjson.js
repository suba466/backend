const fs=require("fs");
fs.readFile("data.json","utf8",(err,data)=>{
    if(err){
        console.error("Error in reading file: ",err)
        return;
    }
    const objArray=JSON.parse(data);
    objArray.forEach(obj => {
        console.log("Id", obj.id);
        console.log("Name: ", obj.name);
        console.log("Age: ", obj.age);
        
    });
    const newObj={id:7,name:"Ananya",age:20};
    objArray.push(newObj);
    fs.writeFile("data.json",JSON.stringify(objArray,null,2),(err,data)=>{
        if(err){
            console.error("Error in writing a file: ",err)
            return;
        }
        console.log("Appended successfully!!")
    })
    
})