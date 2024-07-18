import express from "express";

const application=express()

const port=3000

application.get("/",async(req,res)=>{
    res.json({
        msg:"THIS IS ME",
        status:200
    })
})

application.listen(port,()=>{
    console.log("Running Server at port 3000")
})