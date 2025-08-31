const express=require('express')

const profileRouter=express.Router();
const {isLoggedIn}=require("../middlewares/auth")
const {User}=require("../models/usermodel")




profileRouter.get("/profile", isLoggedIn, async (req, res) => {
  try {
    
    // Same secret key jo login me use kiya tha
  const userID = req.user;
console.log("Decoded token:", userID);

const user = await User.findById(userID.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);

    
    res.status(500).send("Cannot get the profile");
  }
});



module.exports={
    profileRouter
}