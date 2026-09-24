import express from "express";
import Product from "./product.model.js";
const router = express.Router();
router.post("/product", async (req, res) => {
  try {
    const { productName, stock } = req.body;
    if (!productName || !stock) {
      return res.status(400).json({ message: "Missing fields are required" });
    }
    const createProduct = await Product.create({ productName, stock });
    return res
      .status(201)
      .json({ message: "Product creation successfully", createProduct });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "internal server error" });
  }
});
router.get("/product", async (_, res) => {
  try {
    const product = await Product.find();

    return res
      .status(200)
      .json({ message: "Product fetch successfully", data: product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "internal server error" });
  }
});
//Atomic approach: prevent of race condtion
// /product/:productId/purchase
router.patch("/", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOneAndUpdate(
      { _id: productId, stock: { $gt: 0 } },
      {
        $inc: { stock: -1 },
      },
      {
        returnDocument: "after",
      },
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or out of stock" });
    }

    return res
      .status(200)
      .json({ message: "Purchase Request successfully", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "internal server error" });
  }
});
//race-condition-prone code
// /product/:productId/purchase
router.patch("/", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock <= 0) {
      return res.status(400).json({ message: "Out of Stock" });
    }
    product.stock = product.stock - 1;
    await product.save();

    return res
      .status(200)
      .json({ message: "product purchase sucessfully", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "INTERNAL SERVER ERROR" || error.message });
  }
});
//OPTMISTICS LOCKING
// "Main assume kar raha hoon ki conflict nahi hoga. Lekin update karne se pehle check karunga ki jis version ko maine read kiya tha, woh abhi bhi same hai ya nahi."
//when need
// Kya same data ko multiple users/requests simultaneously update kar sakte hain?
// Kya stale data se update hone ka risk hai?
// Kya mujhe conflict hone par update reject karke user ko retry karwana acceptable hai?
router.patch("/product/:productId/purchase", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    if (product.stock <= 0) {
      return res.status(400).json({ message: "Out of Stock" });
    }
    const updateProduct = await Product.findOneAndUpdate(
      {
        _id: productId,
        stock: { $gt: 0 },
        version: product.version,
      },
      {
        $inc: {
          stock: -1,
          version: 1,
        },
      },
      {
        new: true,
      },
    );
    if (!updateProduct) {
      return res.status(409).json({
        message: "Product was modified by another request",
      });
    }

    return res.status(200).json({
      message: "Purchase successful",
      product: updateProduct,
    });
  } catch (error) {
    console.log(error.message);

    return res
      .status(500)
      .json({ message: "INTERNAL SERVER ERROR" || error.message });
  }
});

//Pessimistic Locking
router.patch("/product/:productId/purchase", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById({ _id: productId });
    if (!product) {
      return res.status(404).json({ message: "Productid not found" });
    }
    if (product.stock <= 0) {
      return res.status(400).json({ message: "out of Stock" });
    }

    product.stock = product.stock - 1;
    product.locked = true;
    await product.save();
    return res.status(200).json({ message: "Product purchase succesfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error" || error.message });
  }
});
export default router;
