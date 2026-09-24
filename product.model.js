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

    //adding field for optmistic locking
    version: {
      type: Number,
      default: 0,
    },
    //Pessimisctic locke
    locked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
const Product = mongoose.model("Product", productSchema);
export default Product;
