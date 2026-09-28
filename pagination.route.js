import express from "express";
import Product from "./product.model";

const router = express.Router();

router.post("/pagination", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();
    const totalPage = Math.ceil(products / limit);
    return res.status(200).json({
      success: true,
      page,
      limit,
      totalProducts,
      totalPage,
      products,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
