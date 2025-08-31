const express=require('express')
const  {isLoggedIn}=require("../middlewares/auth")
const {User}=require("../models/usermodel")

const requestRouter=express.Router();


requestRouter.post("/sendConnectionRequest",isLoggedIn,async(req,res)=>{
  try {
    res.send("Connection request sent successfully");
    
  } catch (error) {
     console.error(error);

    
    res.status(500).send("Cannot send the reuqest");
    
  }


})




module.exports={
    requestRouter
}