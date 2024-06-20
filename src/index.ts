import express, {Request,Response} from "express";
import cors from "cors";
import "dotenv/config"; 
import mongoose from "mongoose";
import myUserRoute from './routes/MyUserRoutes'
import myPhoneRoutes from './routes/MyPhoneRoutes'
import phoneshopRoute from './routes/PhoneshopRoute'
import { v2 as cloudinary } from "cloudinary";
import orderRoute from "./routes/OrderRoute"
mongoose
.connect(process.env.MONGO_URI as string )
.then(()=>console.log("Connected to Database!"))

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const app = express();

  app.use(cors());
  
  app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));
  
  app.use(express.json());
  
  app.get("/health", async (req: Request, res: Response) => {
    res.send({ message: "health OK!" });
  })

app.use("/api/my/user",myUserRoute)
app.use("/api/my/phoneshop",myPhoneRoutes)
app.use("/api/phoneshop",phoneshopRoute)
app.use("/api/order",orderRoute)
app.listen(7000,()=>{
    console.log("server started on localhost:7000");
});