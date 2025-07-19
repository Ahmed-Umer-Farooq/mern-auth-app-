import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log("MongoDB connection established successfully"));
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
export default connectDB;

