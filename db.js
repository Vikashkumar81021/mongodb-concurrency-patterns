import mongoose from "mongoose";
// 127.0.0.1
const conn = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Product");
    console.log("Database connection successfully");
  } catch (error) {
    console.log("database connection failed", error.message);
  }
};
export default conn;
