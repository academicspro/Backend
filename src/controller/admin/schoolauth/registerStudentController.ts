import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../db/prisma";
import { uploadFile } from "../../../config/upload";
import { sendRegistrationEmail } from "../../../config/email";
import { randomBytes } from "crypto";

// Register  student

export const registerstudent = async (req: Request, res: Response) => {
  try {
    const {
      email,
      phone,
      AcademicYear,
      AdmissionNo,
      AdmissionDate,
      RollNo,
      status,
      name,
      section,
      sex,
      dateOfBirth,
      bloodType,
      Religion,
      category,
      primaryContact,
      emailAddress,
      caste,
      MotherTongue,
      languagesKnown,
      fatherName,
      fatheremail,
      fatherPhone,
      fatherOccupation,
      motherName,
      motherOccupation,
      motherEmail,
      motherPhone,
      gardianName,
      gardianRealtion,
      gardianEmail,
      gardianPhone,
      gardianOccupation,
      gardianAddress,
      areSiblingStudying,
      siblingName,
      siblingClass,
      siblingRollNo,
      sibllingAdmissionNo,
      currentAddress,
      permanentAddress,
      route,
      vehicleNumber,
      pickUpPoint,
      hostelName,
      roomNumber,
      medicaConditon,
      allergies,
      medicationName,
      schoolName,
      Adress,
      schoolId,
      classId,
    } = req.body;

    console.log(req.body);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    // console.log("Logging Requested File", req.files);

    // Extract multiple files correctly
    const profilePicFile = files?.profilePic?.[0];
    const medicalCertificate = files?.medicalCertificate?.[0];
    const transferCertificate = files?.transferCertificate?.[0];
    console.log(
      "Logging Requested File",
      profilePicFile,
      medicalCertificate,
      transferCertificate
    );

    if (
      !AcademicYear ||
      !AdmissionNo ||
      !AdmissionDate ||
      !RollNo ||
      !status ||
      !name ||
      !section ||
      !sex ||
      !dateOfBirth ||
      !bloodType ||
      !Religion ||
      !category ||
      !primaryContact ||
      !emailAddress ||
      !caste ||
      !MotherTongue ||
      !languagesKnown ||
      !fatherName ||
      !fatheremail ||
      !fatherPhone ||
      !fatherOccupation ||
      !motherName ||
      !motherOccupation ||
      !motherEmail ||
      !motherPhone ||
      !gardianName ||
      !gardianRealtion ||
      !gardianEmail ||
      !gardianPhone ||
      !gardianOccupation ||
      !gardianAddress ||
      !areSiblingStudying ||
      !siblingName ||
      !siblingClass ||
      !siblingRollNo ||
      !sibllingAdmissionNo ||
      !currentAddress ||
      !permanentAddress ||
      !route ||
      !vehicleNumber ||
      !pickUpPoint ||
      !hostelName ||
      !roomNumber ||
      !medicaConditon ||
      !allergies ||
      !medicationName ||
      !schoolId ||
      !classId
    ) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    
    // Validate file uploads
    if (!profilePicFile) {
      res.status(400).json({ error: "Profile picture is required." });
      return;
    }
    if (!medicalCertificate) {
      res.status(400).json({ error: "Medical is required." });
      return;
    }
    if (!transferCertificate) {
      res.status(400).json({ error: "Transfer letter is required." });
      return;
    }

    // Upload files to Cloudinary in parallel
    const [
      profilePicUpload,
      medicalCertificateUpload,
      transferCertificateUpload,
    ] = await Promise.all([
      uploadFile(profilePicFile.buffer, "profile_pics", "image"),
      uploadFile(medicalCertificate.buffer, "medical_certificate", "raw"),
      uploadFile(transferCertificate.buffer, "transfer_letters", "raw"),
    ]);
    console.log(profilePicFile, medicalCertificate, transferCertificate);

    // const profilePicUpload = await
    // uploadFile2(profilePicFile.buffer, "profile_pics","image");

    const tempPassword = randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
      data: {
        name,
        sex,
        email,
        phone,
        password: hashedPassword,
        role: "student",
        profilePic: profilePicUpload.url,
        school: {
          connect: { id: schoolId },
        },
      },
    });

    const student = await prisma.student.create({
      data: {
        AcademicYear,
        AdmissionNo,
        AdmissionDate,
        RollNo,
        status,
        section,
        dateOfBirth,
        Religion,
        category,
        caste,
        MotherTongue,
        languagesKnown,
        fatherName,
        fatheremail,
        fatherPhone,
        fatherOccupation,
        motherName,
        motherOccupation,
        motherEmail,
        motherPhone,
        gardianName,
        gardianRealtion,
        gardianEmail,
        gardianPhone,
        gardianOccupation,
        gardianAddress,
        areSiblingStudying,
        siblingName,
        siblingClass,
        siblingRollNo,
        sibllingAdmissionNo,
        currentAddress,
        permanentAddress,
        route,
        vehicleNumber,
        pickUpPoint,
        hostelName,
        roomNumber,
        medicaConditon,
        allergies,
        medicationName,
        schoolName,
        Adress,

        medicalCertificate: medicalCertificateUpload.url,
        transferCertificate: transferCertificateUpload.url,

        school: {
          connect: { id: schoolId },
        },
        class: {
          connect: { id: classId },
        },
      },
    });

    // Send registration email
    await sendRegistrationEmail(email, tempPassword);

    res
      .status(200)
      .json({ message: "student created successfully", user, student });


  
    const parent = await prisma.parent.create({
      data: {
        gardianName: name,
         gardianEmail: email,
         gardianPhone :phone,
         gardianOccupation,
         gardianAddress,
         gardianRealtion,
         school:{
          connect: { id: schoolId },
         },
        role: "parent",
      },
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { studentId: student.id },
    });

    await sendRegistrationEmail(email, tempPassword);

    res.status(200).json({ message: "parent created successfully", parent });
  } catch (error: any) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all  students

export const getAllstudent = async (req: Request, res: Response) => {
  try {
    const student = await prisma.user.findMany({
      where: {
        role: "student",
      },
    });

    res.status(200).json(student);
  } catch (error) {
    console.error("Error getting Super students:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get Super student by ID

export const getstudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await prisma.user.findUnique({
      where: { id },
    });

    if (!student) {
      res.status(404).json({ error: " student not found." });
      return;
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error getting  student:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Update Super student

export const updatestudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, city, state, country, pincode } =
      req.body;

    const student = await prisma.user.findUnique({
      where: { id },
    });

    if (!student) {
      res.status(404).json({ error: " student not found." });
      return;
    }

    const students = await prisma.user.update({
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

    res.status(200).json(students);
  } catch (error) {
    console.error("Error updating  student:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Delete  student

export const deletestudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await prisma.user.findUnique({
      where: { id },
    });

    if (!student) {
      res.status(404).json({ error: " student not found." });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: " student deleted successfully" });
  } catch (error) {
    console.error("Error deleting  student:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
