import express from "express";
import multer from "multer";
import router from "./MyUserRoutes";
import MyPhoneshopController from "../controllers/MyPhoneshopController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyPhoneshopRequest } from "../middleware/validation";


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.get(
  "/order",
  jwtCheck,
  jwtParse,
  MyPhoneshopController.getMyPhoneshopOrders
);

router.patch(
  "/order/:orderId/status",
  jwtCheck,
  jwtParse,
  MyPhoneshopController.updateOrderStatus
);


router.get("/", jwtCheck, jwtParse, MyPhoneshopController.getMyPhoneshop);
router.post(
    "/",
    upload.single("imageFile"),
    validateMyPhoneshopRequest,
    jwtCheck,
    jwtParse,
    MyPhoneshopController.createPhoneshop
  );

  router.put(
    "/",
    upload.single("imageFile"),
    validateMyPhoneshopRequest,
    jwtCheck,
    jwtParse,
    MyPhoneshopController.updateMyPhoneshop
  );
  export default router;