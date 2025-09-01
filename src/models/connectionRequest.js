const express=require('express')
const mongoose = require('mongoose');


const connectRequest=new mongoose.Schema({

    fromUserID:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    toUserID:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum: {
      values: ['ignore', 'interested', 'accepted', 'rejected'],
      message: '{VALUE} is not a valid status'  // Custom error message
    }
    }

})


const ConnectionRequest=mongoose.model("ConnectionRequest",connectRequest);


module.exports={
    ConnectionRequest
}


