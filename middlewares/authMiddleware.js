import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
      
      // Check if token is valid format before verification
      if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: "Invalid token format" });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      return res.status(401).json({ message: "No token provided" });
    }
  } catch (error) {
    console.log("Auth Error:", error.message);
    
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
