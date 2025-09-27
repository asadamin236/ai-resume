import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
