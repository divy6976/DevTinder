const express=require('express')
const userRoutes=express.Router();
const { ConnectionRequest } = require("../models/connectionRequest");
const { isLoggedIn } = require('../middlewares/auth');
const {User}=require("../models/usermodel")
const USER_SAFE_FIELDS = [
  "firstName",
  "lastName",
  "gender",
  "photourl",
  "age",
  "about",
  "skills"
]

const mongoose = require("mongoose");

// console.log("working in vs")
userRoutes.get("/user/requests/received",isLoggedIn, async (req, res) => {
  //logged user req.user hoga
  //logged user to user id ke equal hoga
  //status interted ho tbhi laye

  const loggedUser=req.user
  console.log(loggedUser,"hello")
  const request =await ConnectionRequest.find({
    toUserID:loggedUser.id,
    status:"interested"


  }).populate("fromUserID","firstName lastName")

  res.status(200).json({
    message: "Data fetched successfully",
    data : request

  })
});


userRoutes.get("/user/requests/connection", isLoggedIn, async (req, res) => {
  const connectUser = req.user;

  try {
    //agar accept h toh dono trf se agar krke dkehe toh match me dikhna chiaye isliye logged user ke liye or use kia
   const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [
        { fromUserID: connectUser.id },
        { toUserID: connectUser.id }
      ]
    })
      .populate("fromUserID", "firstName lastName email")
      .populate("toUserID", "firstName lastName email");
      
      const connectedUsers = connections.map(conn => {
  const fromID = conn.fromUserID._id.toString();
  const toID = conn.toUserID._id.toString();
  const currentID = connectUser.id.toString();

  // Return the other user
  return fromID === currentID ? conn.toUserID : conn.fromUserID;
});

res.status(200).json({
  message: "✅ Connections fetched",
  data: connectedUsers
});



  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({
      message: "❌ Failed to fetch connection requests",
      error: error.message
    });
  }
});

//Akshay should not see the user who are his connection
//Akshay should not see ignored people
// akshay should not see to whom he sent the request                        /user/feed?page=1&limit=10
//AKshay should not see himself
userRoutes.get("/user/feed", isLoggedIn, async (req, res) => {
  //page aur limit string me ata toh pare into integer
  const page=parseInt(req.query.page)||1;
  let limit=parseInt(req.query.limit)||10;
  
  limit=limit > 50 ? 50:limit

const skip=(page-1)*limit;
  

  try {
    const loggedUser = req.user;

    // Step 1: Get all connection requests involving logged-in user
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserID: loggedUser.id },
        { toUserID: loggedUser.id }
      ]
    });
//connectionreuqest me jo h unhe set me dalo 
//user me find jo set se exclude krrhi
    // Step 2: Create a set of excluded user IDs (connected/requested + self) 
    //uneique people chaiyee the isliye set use kia
    const excludedUserIDs = new Set();
    connections.forEach(conn => {
      excludedUserIDs.add(conn.fromUserID.toString());
      excludedUserIDs.add(conn.toUserID.toString());
    });
    excludedUserIDs.add(loggedUser.id); // exclude self

    // Step 3: Get 28 random users who are not in the excluded list
   const suggestions = await User.find(
  {
    _id: {
      $nin: Array.from(excludedUserIDs).map(id => new mongoose.Types.ObjectId(id))
    }
  }

).select(USER_SAFE_FIELDS).skip(skip).limit(limit);


    // Step 4: Send response
    res.status(200).json({
      message: "✅ Tinder-style feed fetched",
      data: suggestions
    });

  } catch (error) {
    console.error("❌ Error in /user/feed:", error);
    res.status(500).json({
      message: "❌ Failed to fetch feed",
      error: error.message
    });
  }
});



module.exports= userRoutes
