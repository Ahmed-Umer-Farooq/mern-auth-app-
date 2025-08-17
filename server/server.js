// Import required modules
import express from "express";
import cors from "cors";
import 'dotenv/config'; // Load environment variables from .env
import cookieParser from "cookie-parser";
import { connect } from "mongoose";
import connectDB from './config/mongodb.js';
import authrouter from './routes/authroutes.js';
import userrouter from './routes/userroutes.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-netlify-app.netlify.app" // Update this with your actual Netlify frontend URL
];

// Connect to MongoDB database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());
// Enable CORS for cross-origin requests with credentials and allowed origins
app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

// Health check route
app.get("/", (req, res) => res.send("Api is working fine 🙂"));

// Mount authentication routes under /api/auth
app.use('/api/auth', authrouter);
// Mount user routes under /api/user
app.use('/api/user', userrouter);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
