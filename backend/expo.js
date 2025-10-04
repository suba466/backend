let express=require("express")
let bd=require("body-parser")
let server=express();
server.use(bd.json({extended:true, size:'5mb'}));
server.use(bd.urlencoded());

let students=[{id:1, name:"Suba shree", marks:22},
              {id:2, name:"Thendral", marks:25},
              {id:3, name:"Ammu", marks:20},
              {id:4, name:"Gokul", marks:28},
              {id:5, name:"Savithri", marks:18},
              {id:6, name:"Ananya", marks:19},
              {id:7, name:"Raji", marks:29},
              {id:8, name:"Sheela", marks:21},
              {id:9, name:"Reena", marks:23},
              {id:10, name:"Shree", marks:19},
]

const valids=(req, res, next)=>{

}
server.get("/",(req,res)=>{
    res.send("Welcome to student management list");
})

server.get("/students",valids,(req,res)=>{
    res.send({msg:"All students fetched..", data:students});
})

server.get("/students/:id",(req,res)=>{
    let id=req.params.id;
    let student=students.find(s=>s.id==id)
    if(student){
        res.send({msg:"Student found", data:student})
    }
    else{
        res.send({msg:"student not found", data:students});
    }
})

server.get("/search",(req,res)=>{
    let name=req.query.name;
    let result=students.filter(s=>s.name.toLowerCase()==name.toLowerCase())
    res.send({msg:"Search results", data:result})
})

server.post("/new",(req,res)=>{
    let {name,marks}=req.body;
    let newStudent={
        id:students.length+1, name, marks:parseInt(marks)
    }
    students.push(newStudent)
    res.send({msg:"Student added", data:newStudent})
})

server.delete("/students/:id", (req, res) => {
  let id = parseInt(req.params.id);
  students = students.filter(s => s.id !== id);
  res.send({ msg: "Student deleted", data:id});
});

server.listen(1433,()=>{
    console.log("Running")
})