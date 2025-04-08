import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRETIME = process.env.EXPIRETIME;

// Register User
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Check saved user data
    console.log("New User Saved:", newUser);

    // Generate JWT token
    const token = await jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: EXPIRETIME,
    });

    console.log("token", token);
    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: EXPIRETIME,
    });
    res.json({
      token,
      user: { username: user.username, email: user.email, _id: user._id },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Google Login
export const googleLogin = async (req, res) => {
  try {
    const { email, username, profilePic, googleId } = req.body;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = new User({
        username,
        email,
        profilePic,
        googleId,
        password: "",
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: EXPIRETIME,
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};
