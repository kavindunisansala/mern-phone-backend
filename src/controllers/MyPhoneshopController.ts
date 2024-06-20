import mongoose from "mongoose";
import Phoneshop from "../models/phoneshop";
import { Request, Response } from "express";
import cloudinary from "cloudinary";
import Order from "../models/order";

const getMyPhoneshop = async (req: Request, res: Response) => {
  try {
    const phoneshop = await Phoneshop.findOne({ user: req.userId });
    if (!phoneshop) {
      return res.status(404).json({ message: "Phoneshop not found" });
    }
    res.json(phoneshop);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching Phoneshop" });
  }
};



const createPhoneshop = async (req: Request, res: Response) => {
    try {
      const existingPhoneshop = await Phoneshop.findOne({ user: req.userId });
  
      if (existingPhoneshop) {
        return res
          .status(409)
          .json({ message: "User Phoneshop already exists" });
      }
  
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
  
      const phoneshop = new Phoneshop(req.body);
      phoneshop.imageUrl = imageUrl;
      phoneshop.user = new mongoose.Types.ObjectId(req.userId);
      phoneshop.lastUpdated = new Date();
      await phoneshop.save();
  
      res.status(201).send(phoneshop);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  const updateMyPhoneshop = async (req: Request, res: Response) => {
    try {
      const phoneshop = await Phoneshop.findOne({
        user: req.userId,
      });
  
      if (!phoneshop) {
        return res.status(404).json({ message: "phoneshop not found" });
      }
  
      phoneshop.phoneshopName = req.body.phoneshopName;
      phoneshop.city = req.body.city;
      phoneshop.country = req.body.country;
      phoneshop.deliveryPrice = req.body.deliveryPrice;
      phoneshop.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
      phoneshop.cuisines = req.body.cuisines;
      phoneshop.phoneItems = req.body.phoneItems;
      phoneshop.lastUpdated = new Date();
  
      if (req.file) {
        const imageUrl = await uploadImage(req.file as Express.Multer.File);
        phoneshop.imageUrl = imageUrl;
      }
  
      await phoneshop.save();
      res.status(200).send(phoneshop);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  const getMyPhoneshopOrders = async (req: Request, res: Response) => {
    try {
      const phoneshop = await Phoneshop.findOne({ user: req.userId });
      if (!phoneshop) {
        return res.status(404).json({ message: "phoneshop not found" });
      }
  
      const orders = await Order.find({ phoneshop: phoneshop._id })
        .populate("phoneshop")
        .populate("user");
  
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
  };
  
  const updateOrderStatus = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "order not found" });
      }
  
      const phoneshop = await Phoneshop.findById(order.phoneshop);
  
      if (phoneshop?.user?._id.toString() !== req.userId) {
        return res.status(401).send();
      }
  
      order.status = status;
      await order.save();
  
      res.status(200).json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "unable to update order status" });
    }
  };
  const uploadImage = async (file: Express.Multer.File) => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
  
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
  };

  export default {
    createPhoneshop,
    getMyPhoneshop,
    updateMyPhoneshop,
    getMyPhoneshopOrders,
    updateOrderStatus
   
  };