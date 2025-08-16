import mongoose from "mongoose";
import User from "../Models/User.model";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET } from "../config/env";
import { Request, Response, NextFunction } from "express";

declare global {
  interface Error {
    statusCode?: number;
  }
}

async function isPasswordValid(
  enteredPassword: string,
  storedHash: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, storedHash);
}

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    console.log("Existing User:", existingUser);
    if (existingUser) {
      const error = new Error("User already exists with this email");
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );
    //@ts-ignore
    const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET! as Secret, {
      expiresIn: JWT_EXPIRATION ?? "1d",
    });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: {
          id: newUser[0]._id,
          name: newUser[0].name,
          email: newUser[0].email,
        },
        token,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Compare the entered password with the stored hashed password
    const isMatch = await isPasswordValid(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //@ts-ignore
    const token = jwt.sign({ userId: user._id }, JWT_SECRET! as Secret, {
      expiresIn: JWT_EXPIRATION ?? "1d",
    });

    // 3. If match, proceed (e.g., generate JWT)
    res.json({ message: "Login successful", token });
  } catch (err) {
    next(err);
  }
};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
