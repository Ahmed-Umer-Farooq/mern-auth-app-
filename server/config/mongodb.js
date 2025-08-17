import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log("MongoDB connection established successfully"));
    // Remove the database name from the connection string as it's included in MONGODB_URI
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
export default connectDB;

