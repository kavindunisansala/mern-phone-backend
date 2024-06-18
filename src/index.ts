import express, {Request,Response} from "express";
import cors from "cors";
import "dotenv/config"; 
import mongoose from "mongoose";
import myUserRoute from './routes/MyUserRoutes'

mongoose
.connect(process.env.MONGO_URI as string )
.then(()=>console.log("Connected to Database!"))

const app=express();
app.use(express.json());
app.use(cors());

app.use("/api/my/user",myUserRoute)

app.listen(7000,()=>{
    console.log("server started on localhost:7000");
});