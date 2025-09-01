const express=require('express')
const  {isLoggedIn}=require("../middlewares/auth")
const {User}=require("../models/usermodel")
const {ConnectionRequest}=require("../models/connectionRequest")
const requestRouter=express.Router();


requestRouter.post("/request/send/:status/:toUserID",isLoggedIn,async(req,res)=>{

  const {status,toUserID}=req.params;

 const fromUserID = req.user.id; // ✅ Correct field name

 const AllowedFields=["ignore","interested"];
 if(!AllowedFields.includes(status)) {
   return res.status(400).send("Invalid status");
 }



  try {

      const relation=await ConnectionRequest.findOne({fromUserID:fromUserID,toUserID:toUserID});
      if(relation){
        res.send("Connection request already exists")

      }

      // ayush shastri ne  daisy shah ko beji      "email": "Daisy@gmail.com",
  // "password": "Daisy@6976"
      // "email": "Ayush@gmail.com",
  // "password": "Ayush@6976"


   const newrequest= new ConnectionRequest({
    fromUserID,
    toUserID,
    status,
  

    })



    const user=await newrequest.save();
    
    res.status(200).json(user);



  } catch (error) {
     console.error(error);

    
    res.status(500).send("Cannot send the request" + error);
    
  }


})




module.exports={
    requestRouter
}