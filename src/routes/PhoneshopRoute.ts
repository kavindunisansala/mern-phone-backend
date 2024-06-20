import express from "express";
import { param } from "express-validator";
import PhoneshopController from "../controllers/PhoneshopController";

const router = express.Router();

router.get(
  "/:phoneshopId",
  param("phoneshopId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("phoneshopId paramenter must be a valid string"),
  PhoneshopController.getPhoneshop
);

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City paramenter must be a valid string"),
  PhoneshopController.searchPhoneshop
);

export default router;