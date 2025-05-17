// src/routes/auth.ts
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = express.Router();

// Signup route
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  console.log("Incoming signup request:", req.body);
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const username = email.split("@")[0];
    const newUser = await User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    console.log("User created:", newUser);
    res.status(201).json({ message: "User created", userId: newUser._id });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login route
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
