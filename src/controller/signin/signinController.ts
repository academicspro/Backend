import { Request, Response } from "express";
import { prisma } from "../../db/prisma";
import bcrypt from "bcrypt";

import { getJwtToken } from "../../utils/jwt_utils";
import { CONFIG } from "../../config";

// Sign-In Controller
export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // Compare the password with the stored hashed password
    if (!user.password) {
      res.status(500).json({ error: "User password is missing." });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid credentials." });
      return;
    }

    // TODO: needto add guid to user and fix token expiry
    // Generate JWT token
    const accessToken = await getJwtToken(
      { userId: user.id, email: user.email, role: user.role },
      CONFIG.JWT_LOGIN_TOKEN_EXPIRY_TIME,
      false
    );

    // TODO: need to add refresh token
    const refreshToken = await getJwtToken(
      { userId: user.id, email: user.email, role: user.role },
      CONFIG.JWT_REFRESH_TOKEN_EXPIRY_TIME,
      true
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    const returnResponseData = {
      accessToken,
      refreshToken,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    res.status(200).json({ success: "ok", ...returnResponseData });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  try {
    if (!userId) {
      console.log("Unauthorized access: No userId found");
      throw new Error("Unauthorized access: No userId found");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, role: true },
    });

    // console.log("Database response:", user);

    if (!user) {
      throw new Error("User not found.");
    }

    return {
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
