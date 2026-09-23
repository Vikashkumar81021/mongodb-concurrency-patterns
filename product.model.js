import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
const Product = mongoose.model("Product", productSchema);
export default Product;
