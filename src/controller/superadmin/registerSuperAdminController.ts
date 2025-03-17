import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { prisma } from "../../db/prisma";
import { uploadFile } from "../../config/upload";
import { sendRegistrationEmail } from "../../config/email";

// Register Super Admin

export const registerSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, city, state, country, pincode, sex, password, bloodType } = req.body;

    const profilePicFile = req.file;
    console.log(profilePicFile);

    // Validate required fields
    if (!name || !email || !phone || !address || !city || !state || !country || !pincode || !sex || !bloodType) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    // Check if file is uploaded
    // Validate file uploads
    if (!profilePicFile) {
      res.status(400).json({ error: "Profile picture is required." });
      return;
    }
    const profilePicUpload = await uploadFile(profilePicFile.buffer, "profile_pics", "image");

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        pincode,
        sex,
        bloodType,
        profilePic: profilePicUpload.url,
        password: hashedPassword,
        role: "superadmin",
      },
    });

    // Send registration email
    await sendRegistrationEmail(email, password);

    res.status(200).json({ message: "SuperAdmin created successfully", user });
  } catch (error) {
    console.error("Error creating SuperAdmin:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get all Super Admins

export const getAllSuperAdmin = async (req: Request, res: Response) => {
  try {
    const superAdmins = await prisma.user.findMany({
      where: {
        role: "superadmin",
      },
    });

    res.status(200).json(superAdmins);
  } catch (error) {
    console.error("Error getting Super Admins:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get Super Admin by ID

export const getSuperAdminById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const superAdmin = await prisma.user.findUnique({
      where: { id },
    });

    if (!superAdmin) {
      res.status(404).json({ error: "Super Admin not found." });
      return;
    }

    res.status(200).json(superAdmin);
  } catch (error) {
    console.error("Error getting Super Admin:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Update Super Admin

export const updateSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, city, state, country, pincode } = req.body;

    const superAdmin = await prisma.user.findUnique({
      where: { id },
    });

    if (!superAdmin) {
      res.status(404).json({ error: "Super Admin not found." });
      return;
    }

    const updatedSuperAdmin = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        pincode,
      },
    });

    res.status(200).json(updatedSuperAdmin);
  } catch (error) {
    console.error("Error updating Super Admin:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Delete Super Admin

export const deleteSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const superAdmin = await prisma.user.findUnique({
      where: { id },
    });

    if (!superAdmin) {
      res.status(404).json({ error: "Super Admin not found." });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: "Super Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting Super Admin:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
