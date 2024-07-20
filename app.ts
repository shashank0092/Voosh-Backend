import dotenv from "dotenv"
import { httpServer } from ".";
import connectDB from "./DB/conn";

dotenv.config({
    path:"./.env"
})

const startServer=()=>{
    httpServer.listen(process.env.PORT||8080,()=>{
        console.info(`Server is running at: http://localhost:${process.env.PORT||8080}`)
    })
}

connectDB()
.then(()=>{startServer()})
.catch((err)=>console.log("MongoDb Connection Error->",err))