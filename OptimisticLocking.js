import express from "express";

const router = express.Router();
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
