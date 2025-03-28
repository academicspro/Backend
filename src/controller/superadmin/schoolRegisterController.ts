import { prisma } from "../../db/prisma";
import { NextFunction, Request, Response } from "express";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { uploadFile } from "../../config/upload";
import { sendRegistrationEmail } from "../../config/email";
import { handlePrismaError } from "../../utils/prismaErrorHandler";

// Register a school

export const registerSchool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, address, city, state, country, pincode, bloodType, sex, schoolName } = req.body;

    const profilePicFile = req.file;

    console.log("logging Request body:", req.body, req.files);

    if (!name || !phone || !email || !address || !city || !state || !country || !pincode || !schoolName) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Validate file uploads
    if (!profilePicFile) {
      res.status(400).json({ error: "Profile picture is required." });
      return;
    }
    const profilePicUpload = await uploadFile(profilePicFile.buffer, "profile_pics", "image");

    const tempPassword = randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

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
        bloodType,
        sex,
        password: hashedPassword,
        profilePic: profilePicUpload.url,
        role: "admin",
      },
    });
    // Send registration email
    await sendRegistrationEmail(email, tempPassword);

    res.status(200).json({ message: "School Admin registered successfully", user });

    const school = await prisma.school.create({
      data: {
        schoolName,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // Step 3: Update User with the School ID
    await prisma.user.update({
      where: { id: user.id },
      data: { schoolId: school.id },
    });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update a school
export const updateSchool = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;
    const { schoolName, name, phone, address, city, state, country, pincode } = req.body;
    const profilePicFile = req.file;

    // Check if school exists
    const school = await prisma.school.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    let profilePicUrl = school.user.profilePic;

    // If a new profile picture is uploaded, replace it
    if (profilePicFile) {
      const profilePicUpload = await uploadFile(profilePicFile.buffer, "profile_pics", "image");
      profilePicUrl = profilePicUpload.url;
    }

    // Update User (Admin)
    await prisma.user.update({
      where: { id: school.user.id },
      data: { name, phone, address, city, state, country, pincode, profilePic: profilePicUrl },
    });

    // Update School
    const updatedSchool = await prisma.school.update({
      where: { id },
      data: { schoolName },
    });

    res.status(200).json({ message: "School updated successfully", school: updatedSchool });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a school
export const deleteSchool = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { id } = req.params;

    // Check if school exists
    const school = await prisma.school.findUnique({
      where: { id },
    });

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // Delete the school (Cascade will handle user deletion)
    await prisma.school.delete({
      where: { id },
    });

    res.status(200).json({ message: "School and associated admin deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};


// // Get all schools

export const getAllSchools = async (req: Request, res: Response) => {
  try {
    const schools = await prisma.school.findMany({
      where: {
        user: {
          role: "admin",
        },
      },
      include: {
        user: true,
      },
    });

    console.log(schools);
    res.status(200).json({ message: "All schools", schools });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get a school by id

export const getSchoolById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        user: true, // Assuming 'users' is the relation field in Prisma schema
      },
    });

    if (!school) {
      res.status(404).json({ message: "School not found" });
      return;
    }

    console.log(school);
    res.status(200).json({ message: "School details", school });
  } catch (error) {
    console.error("Error fetching school:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
