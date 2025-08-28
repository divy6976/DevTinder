const express=require("express")


const app=express();


const {User}=require("./models/usermodel")
const {connectDB}=require("./config/database")

app.use(express.json());   //read the JSOn object and cinvert it into js object and add it to req.body
app.use(express.urlencoded({extended:true}));  //form data url se lene ko liye


app.post("/signup",async (req,res)=>{
    //added the data to the database

    const {firstName,lastName,email,password,age}=req.body;
    console.log(req.body);

if(!firstName || !lastName || !email || !password || !age){
    return res.status(400).send("All fields are required"); }
    

    const user=     await User.create({
            firstName,
            lastName,
            email,
            password,
            age
         })

         try{
            await user.save()
            console.log("User created successfully");
            res.send("user signup successful")
         }catch(err){
             console.log(err);
             res.status(500).send("Internal Server Error");
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
        res.status(500).send("Internal Server Error");
    }
});










connectDB()
.then(()=>{
    console.log("Database connected successfully");
    app.listen(7777, () => {
    console.log("server is running at 7777")
})                   //now it can take requests

}).catch((err)=>{
    console.log("Database not connected");
});

