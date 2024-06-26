import { Request, Response } from "express";
import Phoneshop from "../models/phoneshop";

const getPhoneshop = async (req: Request, res: Response) => {
  try {
    const phoneshopId = req.params.phoneshopId;

    const phoneshop = await Phoneshop.findById(phoneshopId);
    if (!phoneshop) {
      return res.status(404).json({ message: "phonshop not found" });
    }

    res.json(phoneshop);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const searchPhoneshop = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};

    query["city"] = new RegExp(city, "i");
    const cityCheck = await Phoneshop.countDocuments(query);
    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));

      query["cuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { phoneshopName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // sortOption = "lastUpdated"
    const phoneshop = await Phoneshop.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Phoneshop.countDocuments(query);

    const response = {
      data: phoneshop,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  getPhoneshop,
  searchPhoneshop,
};