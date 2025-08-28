const express=require("express")


const app=express();


const {User}=require("./models/usermodel")
const {connectDB}=require("./config/database")

app.use(express.json());   //read the JSOn object and cinvert it into js object and add it to req.body
app.use(express.urlencoded({extended:true}));  //form data url se lene ko liye


app.post("/signup",async (req,res)=>{

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







connectDB()
.then(()=>{
    console.log("Database connected successfully");
    app.listen(7777, () => {
    console.log("server is running at 7777")
})                   //now it can take requests

}).catch((err)=>{
    console.log("Database not connected");
});

