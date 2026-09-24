import Product from "./product.model.js";
import express from "express";

const router = express.Router();
//"Update karne se pehle resource ko lock kar do, taaki doosri request us same resource ko simultaneously modify na kar sake."
// router.patch("/product/:productId/purchase", async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const product = await Product.findById({ _id: productId });
//     if (!product) {
//       return res.status(404).json({ message: "Productid not found" });
//     }
//     if (product.stock <= 0) {
//       return res.status(400).json({ message: "out of Stock" });
//     }

//     product.stock = product.stock - 1;
//     product.locked = true;
//     await product.save();
//     return res.status(200).json({ message: "Product purchase succesfully" });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Internal server error" || error.message });
//   }
// });
router.patch("/product/:productId/purchase", async (req, res) => {
  try {
    const { productId } = req.params;

    // 1. Lock acquire karo
    const product = await Product.findOneAndUpdate(
      {
        _id: productId,
        locked: false,
      },
      {
        $set: {
          locked: true,
        },
      },
      {
        new: true,
      },
    );

    // Product nahi mila ya already locked hai
    if (!product) {
      return res.status(409).json({
        message: "Product is locked or not found",
      });
    }

    // 2. Stock check
    if (product.stock <= 0) {
      // Lock release karna important hai
      await Product.updateOne({ _id: productId }, { $set: { locked: false } });

      return res.status(400).json({
        message: "Out of stock",
      });
    }

    // 3. Purchase/update
    product.stock = product.stock - 1;

    await product.save();

    // 4. Lock release
    await Product.updateOne({ _id: productId }, { $set: { locked: false } });

    return res.status(200).json({
      message: "Product purchased successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
});
