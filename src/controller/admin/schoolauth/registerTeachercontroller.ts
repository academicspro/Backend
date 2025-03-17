import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../db/prisma";
import { uploadFile } from "../../../config/upload";
import { sendRegistrationEmail } from "../../../config/email";
import { randomBytes } from "crypto";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

// Register  teacher

export const registerteacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      sex,
      email,
      phone,
      bloodType,
      dateofJoin,
      fatherName,
      maritalStatus,
      languagesKnown,
      Qualification,
      workExperience,
      previousSchool,
      previousSchoolAddress,
      previousSchoolPhone,
      address,
      PanNumber,
      status,
      salary,
      contractType,
      dateOfPayment,
      medicalLeave,
      casualLeave,
      MaternityLeave,
      SickLeave,
      bankName,
      accountNumber,
      ifscCode,
      branchName,
      Route,
      VehicleNumber,
      PickUpPoint,
      hostelName,
      RoomNumber,
      facebook,
      twitter,
      linkedin,
      instagram,
      youtube,
      schoolId,
      city,
      state,
      country,
      pincode,
      motherName,
      dateOfBirth,
    } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    console.log("Logging Requested File", req.files);

    // Extract multiple files correctly
    const profilePicFile = files?.profilePic?.[0];
    const ResumeFile = files?.Resume?.[0];
    const joiningLetterFile = files?.joiningLetter?.[0];
    console.log("Logging Requested File", profilePicFile, ResumeFile, joiningLetterFile);

    // Validate required fields
    if (
      !name ||
      !sex ||
      !email ||
      !phone ||
      !bloodType ||
      !dateofJoin ||
      !fatherName ||
      !maritalStatus ||
      !languagesKnown ||
      !Qualification ||
      !workExperience ||
      !previousSchool ||
      !previousSchoolAddress ||
      !previousSchoolPhone ||
      !address ||
      !PanNumber ||
      !status ||
      !salary ||
      !contractType ||
      !dateOfPayment ||
      !medicalLeave ||
      !casualLeave ||
      !MaternityLeave ||
      !SickLeave ||
      !bankName ||
      !accountNumber ||
      !ifscCode ||
      !branchName ||
      !Route ||
      !VehicleNumber ||
      !PickUpPoint ||
      !hostelName ||
      !RoomNumber ||
      !facebook ||
      !twitter ||
      !linkedin ||
      !instagram ||
      !youtube ||
      !schoolId
    ) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    // Validate file uploads
    if (!profilePicFile) {
      res.status(400).json({ error: "Profile picture is required." });
      return;
    }
    if (!ResumeFile) {
      res.status(400).json({ error: "Resume is required." });
      return;
    }
    if (!joiningLetterFile) {
      res.status(400).json({ error: "Joining letter is required." });
      return;
    }

    // // Upload files to Cloudinary in parallel
    const [profilePicUpload, resumeUpload, joiningLetterUpload] = await Promise.all([
      uploadFile(profilePicFile.buffer, "profile_pics", "image"),
      uploadFile(ResumeFile.buffer, "resumes", "raw"),
      uploadFile(joiningLetterFile.buffer, "joining_letters", "raw"),
    ]);

    // console.log("Logging uploaded files:", profilePicUpload, resumeUpload, joiningLetterUpload);

    const tempPassword = randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
      data: {
        name,
        sex,
        email,
        phone,
        bloodType,
        address,

        city,
        state,
        country,
        pincode,

        role: "teacher",
        profilePic: profilePicUpload.url,
        password: hashedPassword,
        school: {
          connect: { id: schoolId },
        },
      },
    });

    const teacher = await prisma.teacher.create({
      data: {
        dateofJoin,
        fatherName,
        maritalStatus,
        languagesKnown,
        Qualification,
        workExperience,
        previousSchool,
        previousSchoolAddress,
        previousSchoolPhone,
        motherName,
        dateOfBirth,
        PanNumber,
        status,
        salary: parseInt(salary),
        contractType,
        dateOfPayment,
        medicalLeave,
        casualLeave,
        MaternityLeave,
        SickLeave,
        bankName,
        accountNumber,
        ifscCode,
        branchName,
        Route,
        VehicleNumber,
        PickUpPoint,
        hostelName,
        RoomNumber,
        facebook,
        twitter,
        linkedin,
        instagram,
        youtube,

        Resume: resumeUpload.url,
        joiningLetter: resumeUpload.url,

        school: {
          connect: { id: schoolId },
        },
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { teacherId: teacher.id },
    });

    // Send registration email
    await sendRegistrationEmail(email, tempPassword);

    res.status(200).json({ message: "teacher created successfully", teacher });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Super teachers

export const getAllteacher = async (req: Request, res: Response) => {
  try {
    const teacher = await prisma.user.findMany({
      where: {
        role: "teacher",
      },
    });

    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error getting Super teachers:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get Super teacher by ID

export const getteacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      res.status(404).json({ error: " teacher not found." });
      return;
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error getting  teacher:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Update Super teacher

export const updateteacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, city, state, country, pincode } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      res.status(404).json({ error: " teacher not found." });
      return;
    }

    const teachers = await prisma.user.update({
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

    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error updating  teacher:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Delete  teacher

export const deleteteacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const teacher = await prisma.user.findUnique({
      where: { id },
    });

    if (!teacher) {
      res.status(404).json({ error: " teacher not found." });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: " teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting  teacher:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
