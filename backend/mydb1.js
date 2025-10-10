const exp = require("express");
const mongoose = require("mongoose");
const bd = require("body-parser");

const app = exp();
app.use(bd.urlencoded({ extended: true }));
app.use(bd.json());

mongoose.connect("mongodb://localhost:27017/suba")
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(err));

// User Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  phone: { type: String, trim: true, unique: true, required: true },
  city: { type: String, trim: true },
  age: { type: Number }
});

const User = mongoose.model("users", userSchema);

// create
app.post("/reg", async (req, res) => {
  try {
    const { name, phone, city, age } = req.body;
    const newUser = await User.create({ name, phone, city, age });
    res.status(201).json({ message: " Registered successfully", user: newUser });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

//  read
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// read
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

//  update
app.put("/users/:id", async (req, res) => {
  try {
    const { name, phone, city, age } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, city, age },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: " User updated", user: updatedUser });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

//  delete
app.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: " User deleted" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//search
app.get("/search",async(req,res)=>{
    let {keyword}=req.query;
    try{
        const result=await User.find({
        $or:[
            {name:{$regex:keyword,$options:"i"}},
            {city:{$regex:keyword,$options:"i"}}
        ]
    });res.json({msg:"",user:result})
    }catch(err){
        res.status(400).json({err:err.message})
    }
    
})
// Filter users by city and age range
app.get("/users-filter", async (req, res) => {
  try {
    const { city, minAge, maxAge } = req.query;
    const filter = {};

    if (city) filter.city = city;
    if (minAge) filter.age = { ...filter.age, $gte: Number(minAge) };
    if (maxAge) filter.age = { ...filter.age, $lte: Number(maxAge) };

    const users = await User.find(filter);
    res.json({ message: "Filtered users", users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sort users by a field and order
app.get("/users-sort", async (req, res) => {
  try {
    const { sortBy, sortOrder } = req.query; // e.g., sortBy="age", sortOrder="asc"

    if (!sortBy) {
      return res.status(400).json({ error: "sortBy query param required" });
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const users = await User.find().sort(sort);
    res.json({ message: "Sorted users", users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Server Start
app.listen(9000);
