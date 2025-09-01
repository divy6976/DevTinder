const express=require("express")
const bcrypt=require("bcrypt")
const validator=require("validator")
const cookieParser = require('cookie-parser');
const jwt=require("jsonwebtoken")
const {isLoggedIn}=require("./middlewares/auth")

const app=express();

// Middleware order is important - body parsing should come first
app.use(express.json());   //read the JSON object and convert it into js object and add it to req.body
app.use(express.urlencoded({extended:true}));  //form data url se lene ko liye
app.use(cookieParser());

// Add debugging middleware to see what's happening with requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('Body:', req.body);
  next();
});

const {User}=require("./models/usermodel")
const {connectDB}=require("./config/database")


const {authRouter}=require("./routes/authRouter")
const {profileRouter}=require("./routes/profileRouter")
const {requestRouter}=require("./routes/requestRouter")





app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)









connectDB()
.then(()=>{
    console.log("Database connected successfully");
    app.listen(7777, () => {
    console.log("server is running at 7777")
})                   //now it can take requests

}).catch((err)=>{
    console.log("Database not connected");
});

