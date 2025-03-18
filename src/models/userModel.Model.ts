import { z } from "zod";
import { UserSexEnum, RoleEnum, EmployeeTypeEnum } from "./enumsModels.Model";

const CreateUserSchema = z.object({
  name: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().min(1, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City name is required" }),
  state: z.string().min(1, { message: "State name is required" }),
  country: z.string().min(1, { message: "Country name is required" }),
  pincode: z.string().min(1, { message: "Postal code is required" }),
  bloodType: z.string().min(1, { message: "Blood type is required" }),
  sex: UserSexEnum,

  // Optional fields
  role: RoleEnum.optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
  profilePic: z.string().optional(),
  schoolId: z.string().optional(),
  teacherId: z.string().optional(),
  studentId: z.string().optional(),
  parentId: z.string().optional(),
  libraryId: z.string().optional(),
  hostelId: z.string().optional(),
  transportId: z.string().optional(),
  accountId: z.string().optional(),
  employeeType: EmployeeTypeEnum.optional(),
  departmentId: z.string().optional(),
  designationId: z.string().optional(),
});

// Get By ID schema

const GetUserSchema = z.object({
  id: z.string().min(1, { message: "User ID is required" }),
});

const UpdateUserSchema = z.object({
  id: z.string().min(1, { message: "User ID is required" }),
  data: z
    .object({
      name: z.string().min(1, { message: "Full name cannot be empty" }),
      email: z.string().email({ message: "Invalid email address" }),
      phone: z.string().min(1, { message: "Phone number cannot be empty" }),
      profilePic: z.string(),
      password: z.string().min(8, { message: "Password must be at least 8 characters" }),
      address: z.string().min(1, { message: "Street address cannot be empty" }),
      city: z.string().min(1, { message: "City name cannot be empty" }),
      state: z.string().min(1, { message: "State name cannot be empty" }),
      country: z.string().min(1, { message: "Country name cannot be empty" }),
      pincode: z.string().min(1, { message: "Postal code cannot be empty" }),
      bloodType: z.string().min(1, { message: "Blood type cannot be empty" }),
      sex: UserSexEnum,
      role: RoleEnum,
      schoolId: z.string(),
      reputation: z.number().int({ message: "Reputation must be an integer" }),
      coins: z.number().int({ message: "Coins must be an integer" }),
      redeemedBalance: z.number({ message: "Redeemed balance must be a number" }),
      teacherId: z.string(),
      studentId: z.string(),
      parentId: z.string(),
      libraryId: z.string(),
      hostelId: z.string(),
      transportId: z.string(),
      accountId: z.string(),
      employeeType: EmployeeTypeEnum,
      departmentId: z.string(),
      designationId: z.string(),
    })
    .partial(), 
});

const DeleteUserSchema = z.object({
  id: z.string().min(1, { message: "User ID is required" }),
});

export { CreateUserSchema, GetUserSchema, UpdateUserSchema, DeleteUserSchema };
