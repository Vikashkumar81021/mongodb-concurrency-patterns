import express from "express";
import conn from "./db.js";
import router from "./route.js";

const app = express();
app.use(express.json());
conn();
app.use("/api/v1", router);
app.listen(3000, () => {
  console.log("Server is listen on 3000");
});
