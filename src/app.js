const express=require("express")


const app=express();




app.get("/user",(req,res)=>{

    res.send({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com"
    })

})

app.post("/user",(req,res)=>{
res.send("post request received")
})

app.put("/user",(req,res)=>{
   res.send("user update succesfully in put")
})


app.patch("/user",(req,res)=>{
   res.send("email fixed in patch")
})

app.delete("/user",(req,res)=>{
   res.send("user deleted successfully")
})



app.use("/test",(req,res)=>{
    res.send("hello boy")
})










app.listen(7777,()=>{
    console.log("server is running at 7777")
})                   //now it can take requests
