import Product from "./product.model.js";

router.get("/products", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const cursor = req.query.cursor;

    const query = {};

    // Agar cursor mila hai
    if (cursor) {
      query._id = {
        $gt: cursor,
      };
    }

    //.sort({ _id: 1 }) kyun-> Cursor pagination mein stable ordering bahut important hai.
    const products = await Product.find(query).sort({ _id: 1 }).limit(limit);

    // Next request ke liye cursor
    const nextCursor =
      products.length > 0 ? products[products.length - 1]._id : null;

    return res.status(200).json({
      success: true,
      products,
      nextCursor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//reponse {
//   "products": [
//     "P6",
//     "P7",
//     "P8",
//     "P9",
//     "P10"
//   ],
//   "nextCursor": "P10_ID"
// }
