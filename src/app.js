const express=require("express")
const bcrypt=require("bcrypt")
const validator=require("validator")

const app=express();


const {User}=require("./models/usermodel")
const {connectDB}=require("./config/database")

app.use(express.json());   //read the JSOn object and cinvert it into js object and add it to req.body
app.use(express.urlencoded({extended:true}));  //form data url se lene ko liye


app.post("/signup", async (req, res) => {
    //validate the data
    //alagh se function likhne ki koi jrrut nhi 
  const { firstName, lastName, email, password, age } = req.body;
  console.log(req.body);

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send("All fields are required");
  }
   if (!validator.isEmail(email)) {
    return res.status(400).send("Invalid email ");
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Create new user document
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      age,
    });

    // Save new user (runs schema validations automatically)
    await newUser.save();

    console.log("User created successfully");
    res.send("User signup successful");
  } catch (err) {
    console.error(err);

    // Handle validation errors separately to provide useful feedback
    if (err.name === "ValidationError") {
      // Collect all validation error messages
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).send(messages.join(", "));
    }

    res.status(500).send("Internal Server Error");
  }
});


app.post("/login",async(req,res)=>{
    //email password lo
    //validate kro
    //email se exist or nnot
        //pass veirfy
        //if all true token genertae through jwt
        //db me store
        // token bejdo
        //succes message bejdo
  const { email, password } = req.body;

 



  console.log("req.body:", req.body);
  if (!email || !password) {
    return res.status(400).send("Email and password required");
  }
   if (!validator.isEmail(email)) {
    return res.status(400).send("Invalid email ");
  }

                 try {
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).send("Invalid Credentials");
  }
  res.send("Login successful");
          


} catch (err) {
  console.error(err);
  res.status(500).send("Login not successful");
}

})







//get the user from email
app.get("/user",async(req,res)=>{
   const email = req.body.email;
       if(!email){
        return res.status(400).send("Email is required");
       }
       try {
         const user= await User.find({email})

      if(user.length === 0){
         return res.status(400).send("User not found");

        
      }
      console.log(user);
      console.log("user mil gya")
      return  res.status(200).json(user)
        
       } catch (error) {
          console.log(error);
          res.status(500).send("Something went wrong");
       }
     

})


app.get("/feed",async (req,res)=>{
    //get all user profiles from database
    try {
           const users = await User.find({})
           res.status(200).json(users)
    } catch (error) {
           console.log(error);
           res.status(500).send("profiles not found");
    }
    
})

//get user by id

app.get("/profile",async(req,res)=>{
    const id=req.body.id;
    try {

          const user= await User.findById({_id:id})

  if(!user){
      return res.status(404).send("User not found");
  }

  return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("User profile by id not found");
    }


})

app.delete("/delete",async(req,res)=>{
    const id=req.body.id;
    try {
        const user= await User.findByIdAndDelete({_id:id})
        if(!user){
            return res.status(404).send("User not found");
        }
        console.log(user)
        res.send("User deleted successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("User cannot be deleted");
    }
});




app.patch("/update",async (req,res)=>{
    const id=req.body.id;
   try {
    if (req.body.email && req.body.email !== user.email) {
  return res.status(400).send("Email cannot be changed");
}

     const user=await User.findByIdAndUpdate({_id:id},req.body,{ new: true, runValidators: true })  //new:true means return the updated user;
     console.log(req.body);




    res.send("user updated successfully")

    
   } catch (error) {
       console.log(error);
       res.status(500).send("Internal Server Error");
   }

})




connectDB()
.then(()=>{
    console.log("Database connected successfully");
    app.listen(7777, () => {
    console.log("server is running at 7777")
})                   //now it can take requests

}).catch((err)=>{
    console.log("Database not connected");
});

