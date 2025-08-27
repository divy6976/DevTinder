const express=require("express")


const app=express();
const { adminauth,userauth } = require('../middlewares/auth');



app.use("/admin",adminauth);

app.get("/admin/dashboard",(req,res)=>{
   res.send("Welcome to the admin dashboard");
});

app.get("/admin/settings",(req,res)=>{
   res.send("Welcome to the admin settings");
});


app.post("/user/login",(req,res)=>{
    res.send("Welcome to the user login page");
})

app.use("/user",userauth)


app.get("/user/profile",(req,res)=>{
    res.send("Welcome to the user profile page");
})

app.get("/user/settings",(req,res)=>{   
    throw new Error("Simulated server error");
})

app.get("/user/settings",(req,res)=>{   
   res.send("Welcome to the user settings page");
})

app.use("/",(err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send("Something broke!");
})









app.listen(7777,()=>{
    console.log("server is running at 7777")
})                   //now it can take requests
