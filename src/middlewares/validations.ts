import { z } from "zod";

// School Validator

export const schoolSchema = z.object({
  id: z.string().cuid({ message: "Invalid ID format." }),
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  SchoolName: z
    .string()
    .min(3, { message: "School name must be at least 3 characters long." })
    .max(100, { message: "School name must be at most 100 characters long." })
    .regex(/^[a-zA-Z0-9\s]+$/, { message: "School name must be alphanumeric." }),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
  userId: z.string().cuid({ message: "Invalid user ID format." }),

  students: z.array(z.string().cuid()).optional(),
  teachers: z.array(z.string().cuid()).optional(),
  parents: z.array(z.string().cuid()).optional(),
  libraries: z.array(z.string().cuid()).optional(),
  hostels: z.array(z.string().cuid()).optional(),
  transports: z.array(z.string().cuid()).optional(),
  accounts: z.array(z.string().cuid()).optional(),
  subscription: z.array(z.string().cuid()).optional(),
  fees: z.array(z.string().cuid()).optional(),
  paymentSecret: z.string().optional(),
  Ticket: z.array(z.string().cuid()).optional(),
  Feedback: z.array(z.string().cuid()).optional(),
  BusStops: z.array(z.string().cuid()).optional(),
  Routes: z.array(z.string().cuid()).optional(),
  Incharges: z.array(z.string().cuid()).optional(),
  Conductors: z.array(z.string().cuid()).optional(),
  Drivers: z.array(z.string().cuid()).optional(),
  Buses: z.array(z.string().cuid()).optional(),
  SalaryPayment: z.array(z.string().cuid()).optional(),
  departments: z.array(z.string().cuid()).optional(),
  designations: z.array(z.string().cuid()).optional(),
  duties: z.array(z.string().cuid()).optional(),
  payrolls: z.array(z.string().cuid()).optional(),
  inventoryItems: z.array(z.string().cuid()).optional(),
  visitors: z.array(z.string().cuid()).optional(),
});

// School Validator
export const validateSchoolInput = (input: any) => {
  const result = schoolSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Department Validator

export const departmentSchema = z.object({
  id: z.string().cuid({ message: "Invalid ID format." }),
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  name: z
    .string()
    .min(3, { message: "Department name must be at least 3 characters long." })
    .max(100, { message: "Department name must be at most 100 characters long." })
    .regex(/^[a-zA-Z0-9\s]+$/, { message: "Department name must be alphanumeric." }),
  description: z.string().max(500, { message: "Description must not exceed 500 characters." }).optional(),
  schoolId: z.string().cuid({ message: "Invalid school ID format." }),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

export const validateDepartmentInput = (input: any) => {
  const result = departmentSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Designation Validator

export const designationSchema = z.object({
  id: z.string().cuid({ message: "Invalid ID format." }),
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  name: z
    .string()
    .min(3, { message: "Designation name must be at least 3 characters long." })
    .max(100, { message: "Designation name must be at most 100 characters long." })
    .regex(/^[a-zA-Z0-9\s]+$/, { message: "Designation name must be alphanumeric." }),
  description: z.string().max(500, { message: "Description must not exceed 500 characters." }).optional(),
  schoolId: z.string().cuid({ message: "Invalid school ID format." }),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

export const validateDesignationInput = (input: any) => {
  const result = designationSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Payroll Validator

export const payrollSchema = z.object({
  id: z.string().cuid({ message: "Invalid ID format." }),
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  userId: z.string().cuid({ message: "Invalid user ID format." }),
  schoolId: z.string().cuid({ message: "Invalid school ID format." }),
  periodStart: z.string().datetime({ message: "Invalid period start date format. Use ISO 8601 format." }),
  periodEnd: z.string().datetime({ message: "Invalid period end date format. Use ISO 8601 format." }),
  grossSalary: z.number().positive({ message: "Gross salary must be a positive number." }),
  deductions: z.number().min(0, { message: "Deductions must be zero or a positive number." }).default(0),
  netSalary: z.number().positive({ message: "Net salary must be a positive number." }),
  paymentDate: z.string().datetime({ message: "Invalid payment date format. Use ISO 8601 format." }).optional(),
  status: z.enum(["PENDING", "PAID", "FAILED"], { message: "Invalid payroll status." }),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

export const validatePayrollInput = (input: any) => {
  const result = payrollSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// HRM   Inventory Item Validator

export const inventoryItemSchema = z.object({
  id: z.string().cuid({ message: "Invalid ID format." }),
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  description: z.string().optional(),
  quantity: z
    .number()
    .int({ message: "Quantity must be an integer." })
    .min(0, { message: "Quantity cannot be negative." }),
  schoolId: z.string().cuid({ message: "Invalid school ID format." }),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

export const validateInventoryItemInput = (input: any) => {
  const result = inventoryItemSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// HRM Inventory Transaction Validator

// Define transaction types (assuming it's an enum)
export const transactionTypeEnum = z.enum(["ADD", "REmove", "TRANSFER"]); // Modify as per your enum values

export const inventoryTransactionSchema = z.object({
  id: z.string().cuid({ message: "Invalid ID format." }),
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  inventoryItemId: z.string().cuid({ message: "Invalid inventory item ID format." }),
  type: transactionTypeEnum,
  quantity: z
    .number()
    .int({ message: "Quantity must be an integer." })
    .min(1, { message: "Quantity must be at least 1." }),
  date: z.date().or(z.string().datetime()).optional(),
  userId: z.string().cuid().optional(),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate input
export const validateInventoryTransactionInput = (input: any) => {
  const result = inventoryTransactionSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// User Validator

export const RoleEnum = z.enum([
  "superadmin",
  "admin",
  "teacher",
  "student",
  "parent",
  "library",
  "hostel",
  "account",
  "transport",
]);

// Define UserSex Enum (Modify as per your actual values)
export const UserSexEnum = z.enum(["Male", "Female", "Other"]);

export const userSchema = z.object({
  id: z.string().cuid({ message: "Invalid ID format." }),
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  email: z.string().email({ message: "Invalid email format." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }),
  profilePic: z.string().url({ message: "Invalid profile picture URL." }).optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }).optional(),
  address: z.string().min(5, { message: "Address must be at least 5 characters long." }),
  city: z.string().min(2, { message: "City name must be at least 2 characters long." }),
  state: z.string().min(2, { message: "State name must be at least 2 characters long." }),
  country: z.string().min(2, { message: "Country name must be at least 2 characters long." }),
  pincode: z.string().regex(/^\d{6}$/, { message: "Pincode must be 6 digits." }),
  bloodType: z.string().regex(/^(A|B|AB|O)[+-]$/, { message: "Invalid blood type." }),
  sex: UserSexEnum,
  role: RoleEnum.default("superadmin"),
  schoolId: z.string().cuid().optional(),
  reputation: z.number().int().min(0).default(0),
  coins: z.number().int().min(0).default(0),
  redeemedBalance: z.number().min(0).default(0),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
  departmentId: z.string().cuid().optional(),
  designationId: z.string().cuid().optional(),
});

// Function to validate input
export const validateUserInput = (input: any) => {
  const result = userSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Password Reset Token Validator

export const passwordResetTokenSchema = z.object({
  id: z.number().int().positive().optional(), // Auto-incremented, so optional
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  token: z.string().min(20, { message: "Token must be at least 20 characters long." }),
  userId: z.string().cuid({ message: "Invalid User ID format." }),
  createdAt: z.date().or(z.string().datetime()).optional(),
  expiresAt: z.date().or(z.string().datetime()),
  usedAt: z.date().or(z.string().datetime()).nullable().optional(),
});

// Function to validate input
export const validatePasswordResetTokenInput = (input: any) => {
  const result = passwordResetTokenSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Plan Validator

export const planSchema = z.object({
  id: z.string().cuid().optional(), // Auto-generated by Prisma
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  name: z.enum(["Basic", "Pro", "Enterprise"], { message: "Invalid plan name." }),
  price: z.number().positive({ message: "Price must be a positive number." }),
  durationDays: z.enum([7, 15, 30], { message: "Invalid duration. Choose from 7, 15, or 30 days." }),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate input
export const validatePlanInput = (input: any) => {
  const result = planSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Subscription Validator

export const subscriptionSchema = z.object({
  id: z.string().cuid().optional(), // Auto-generated by Prisma
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  schoolId: z.string().cuid({ message: "Invalid school ID format." }),
  planId: z.string().cuid({ message: "Invalid plan ID format." }),
  startDate: z.date().or(z.string().datetime({ message: "Invalid start date format." })),
  endDate: z.date().or(z.string().datetime({ message: "Invalid end date format." })),
  isActive: z.boolean().default(true),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate input
export const validateSubscriptionInput = (input: any) => {
  const result = subscriptionSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Payment Validator

export const paymentSchema = z.object({
  id: z.string().cuid().optional(), // Auto-generated by Prisma
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  feeId: z.string().cuid({ message: "Invalid Fee ID format." }),
  amount: z.number().positive({ message: "Amount must be a positive number." }),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  method: z.enum(["Cash", "Online"]).optional(),
  status: z.enum(["Pending", "PAID", "Failed"]).default("Pending"),
  paymentDate: z.date().or(z.string().datetime({ message: "Invalid payment date format." })),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate input
export const validatePaymentInput = (input: any) => {
  const result = paymentSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Salary Payment Validator

export const salaryPaymentSchema = z.object({
  id: z.string().cuid().optional(), // Auto-generated by Prisma
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  teacherId: z.string().cuid({ message: "Invalid Teacher ID format." }),
  schoolId: z.string().cuid({ message: "Invalid School ID format." }),
  amount: z.number().int().positive({ message: "Amount must be a positive integer." }),
  period: z.string().regex(/^\d{4}-\d{2}$/, { message: "Period must be in YYYY-MM format." }),
  paymentDate: z.date().or(z.string().datetime({ message: "Invalid payment date format." })),
  method: z.enum(["Cash", "Bank Transfer"]),
  status: z.enum(["Success", "Failed"]),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate input
export const validateSalaryPaymentInput = (input: any) => {
  const result = salaryPaymentSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Notification Validator

export const notificationSchema = z.object({
  id: z.string().cuid().optional(), // Auto-generated by Prisma
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  feeId: z.string().cuid({ message: "Invalid Fee ID format." }),
  type: z.enum(["Reminder", "Overdue"], { message: "Type must be 'Reminder' or 'Overdue'." }),
  sentAt: z
    .date()
    .or(z.string().datetime({ message: "Invalid sent date format." }))
    .optional(),
  createdAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate input
export const validateNotificationInput = (input: any) => {
  const result = notificationSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Ticket Validator

export const ticketSchema = z.object({
  id: z.string().cuid().optional(), // Auto-generated by Prisma
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters long." }),
  status: z.enum(["Open", "Closed"], { message: "Status must be 'Open' or 'Closed'." }).default("Open"),
  priority: z
    .enum(["Low", "Medium", "High"], { message: "Priority must be 'Low', 'Medium', or 'High'." })
    .default("Low"),
  schoolId: z.string().cuid({ message: "Invalid School ID format." }),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate input
export const validateTicketInput = (input: any) => {
  const result = ticketSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Feedback Validator

export const feedbackSchema = z.object({
  id: z.string().cuid().optional(), // Auto-generated by Prisma
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters long." }),
  schoolId: z.string().cuid({ message: "Invalid School ID format." }),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate input
export const validateFeedbackInput = (input: any) => {
  const result = feedbackSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Todo Validator

export const todoStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"], {
  message: "Invalid status. Allowed values: PENDING, IN_PROGRESS, COMPLETED.",
});

export const todoSchema = z.object({
  id: z.string().cuid().optional(), // Auto-generated by Prisma
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters long." }),
  status: todoStatusEnum.default("PENDING"),
  userId: z.string().cuid({ message: "Invalid User ID format." }),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate input
export const validateTodoInput = (input: any) => {
  const result = todoSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// PAYMENT SECRET VALIDATOR

export const paymentSecretSchema = z.object({
  id: z.string().cuid().optional(), // Auto-generated by Prisma
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  schoolId: z.string().cuid({ message: "Invalid School ID format." }),
  keyId: z.string().min(10, { message: "Key ID must be at least 10 characters long." }),
  keySecret: z.string().min(10, { message: "Key Secret must be at least 10 characters long." }),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate input
export const validatePaymentSecretInput = (input: any) => {
  const result = paymentSecretSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// FEE VALIDATOR

export const feeStatusEnum = z.enum(["Pending", "Partial", "PAID", "Overdue"], {
  message: "Invalid fee status. Allowed values: Pending, Partial, PAID, Overdue.",
});

export const feeSchema = z.object({
  id: z.string().cuid().optional(), // Auto-generated by Prisma
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  studentId: z.string().cuid({ message: "Invalid Student ID format." }),
  schoolId: z.string().cuid({ message: "Invalid School ID format." }),
  amount: z.number().positive({ message: "Amount must be a positive number." }),
  dueDate: z
    .date()
    .or(z.string().datetime())
    .refine((date) => new Date(date) > new Date(), {
      message: "Due date must be in the future.",
    }),
  category: z.string().min(3, { message: "Category must be at least 3 characters long." }),
  finePerDay: z.number().min(0, { message: "Fine per day cannot be negative." }).default(0),
  status: feeStatusEnum.default("Pending"),
  paymentDate: z.date().or(z.string().datetime()).optional(),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate Fee input
export const validateFeeInput = (input: any) => {
  const result = feeSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Event Validator

export const eventSchema = z.object({
  id: z.string().cuid().optional(),
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters long." }),
  startTime: z
    .date()
    .or(z.string().datetime())
    .refine((date) => new Date(date) > new Date(), {
      message: "Start time must be in the future.",
    }),
  endTime: z.date().or(z.string().datetime()),
  classId: z.string().cuid().optional(),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate Event input
export const validateEventInput = (input: any) => {
  const result = eventSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Announcement Validator

export const announcementSchema = z.object({
  id: z.string().cuid().optional(),
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters long." }),
  date: z
    .date()
    .or(z.string().datetime())
    .refine((date) => new Date(date) > new Date(), {
      message: "Date must be in the future.",
    }),
  classId: z.string().cuid().optional(),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate Announcement input
export const validateAnnouncementInput = (input: any) => {
  const result = announcementSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Visitor Validator

export const visitorSchema = z.object({
  id: z.string().cuid().optional(), // Auto-generated by Prisma
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  phone: z.string().regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits." }),
  email: z.string().email({ message: "Invalid email format." }).optional(),
  purpose: z.string().min(3, { message: "Purpose must be at least 3 characters long." }),
  token: z.string().min(5, { message: "Token must be at least 5 characters long." }),
  validFrom: z
    .date()
    .or(z.string().datetime())
    .refine((date) => new Date(date) > new Date(), {
      message: "Valid from date must be in the future.",
    }),
  validUntil: z
    .date()
    .or(z.string().datetime())
    .refine(
      (date, ctx) => {
        if (ctx.parent.validFrom && new Date(date) <= new Date(ctx.parent.validFrom)) {
          return false;
        }
        return true;
      },
      { message: "Valid until date must be after valid from date." }
    ),
  entryTime: z.date().or(z.string().datetime()).optional(),
  exitTime: z.date().or(z.string().datetime()).optional(),
  schoolId: z.string().cuid({ message: "Invalid School ID format." }),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate Visitor input
export const validateVisitorInput = (input: any) => {
  const result = visitorSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};

// Teacher Validator

// Enum for Marital Status
const MaritalStatusEnum = z.enum(["Single", "Married", "Divorced", "Widowed"]);

export const teacherSchema = z.object({
  id: z.string().cuid().optional(), // Auto-generated by Prisma
  guid: z.string().cuid({ message: "Invalid GUID format." }),
  dateofJoin: z.date().or(z.string().datetime()).optional(),
  fatherName: z.string().min(3, { message: "Father's Name must be at least 3 characters long." }),
  motherName: z.string().min(3, { message: "Mother's Name must be at least 3 characters long." }),
  dateOfBirth: z.date().or(z.string().datetime()),
  maritalStatus: MaritalStatusEnum,
  languagesKnown: z.string().min(2, { message: "At least one language must be specified." }),
  Qualification: z.string().min(2, { message: "Qualification must be at least 2 characters long." }),
  workExperience: z.string().min(1, { message: "Work experience must be specified." }),
  previousSchool: z.string().min(3, { message: "Previous school name must be at least 3 characters." }),
  previousSchoolAddress: z.string().min(5, { message: "Previous school address must be at least 5 characters." }),
  previousSchoolPhone: z.string().regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits." }),
  PanNumber: z.string().min(10, { message: "PAN number must be valid (10 characters)." }),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  salary: z.number().min(1000, { message: "Salary must be at least 1000." }),
  contractType: z.enum(["Full Time", "Part Time"]).default("Full Time"),
  dateOfPayment: z.date().or(z.string().datetime()),
  medicalLeave: z.string(),
  casualLeave: z.string(),
  MaternityLeave: z.string(),
  SickLeave: z.string(),
  accountNumber: z.string().min(10, { message: "Account number must be at least 10 digits." }),
  bankName: z.string().min(3, { message: "Bank name must be at least 3 characters." }),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Invalid IFSC Code format." }),
  branchName: z.string().min(3, { message: "Branch name must be at least 3 characters." }),
  Route: z.string().optional(),
  VehicleNumber: z.string().optional(),
  PickUpPoint: z.string().optional(),
  hostelName: z.string().optional(),
  RoomNumber: z.string().optional(),
  facebook: z.string().url().optional(),
  twitter: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  instagram: z.string().url().optional(),
  youtube: z.string().url().optional(),
  Resume: z.string().url({ message: "Resume must be a valid URL." }),
  joiningLetter: z.string().url({ message: "Joining letter must be a valid URL." }),
  schoolId: z.string().cuid({ message: "Invalid School ID format." }),
  userId: z.string().cuid().optional(),
  createdAt: z.date().or(z.string().datetime()).optional(),
  updatedAt: z.date().or(z.string().datetime()).optional(),
});

// Function to validate Teacher input
export const validateTeacherInput = (input: any) => {
  const result = teacherSchema.safeParse(input);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  return result.data;
};
