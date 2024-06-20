import mongoose, { InferSchemaType } from "mongoose";

const phoneItemSchema = new mongoose.Schema({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
  });
export type PhoneItemType=InferSchemaType<typeof phoneItemSchema>;

  const phoneshopSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    phoneshopName: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    deliveryPrice: { type: Number, required: true },
    estimatedDeliveryTime: { type: Number, required: true },
    cuisines: [{ type: String, required: true }],
    phoneItems: [phoneItemSchema],
    imageUrl: { type: String, required: true },
    lastUpdated: { type: Date, required: true },
  });

  const Phoneshop = mongoose.model("Phoneshop", phoneshopSchema);
        export default Phoneshop;