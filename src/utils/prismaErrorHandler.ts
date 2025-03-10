import { Prisma } from "@prisma/client";
import { ApiError } from "./apiError";


export const handlePrismaError = (error: any): ApiError => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return new ApiError(
          409,
          `Duplicate value detected for field: ${error.meta?.target?.toString()}`,
          error.meta
        );

      case "P2003":
        return new ApiError(
          400,
          `Foreign key constraint failed on field: ${error.meta?.field_name}`,
          error.meta
        );

      case "P2025":
        return new ApiError(404, "Record not found. Unable to proceed.", error.meta);

      case "P2014":
        return new ApiError(
          400,
          "Nested relation conflict. The action violates a required relation.",
          error.meta
        );

      case "P2000":
        return new ApiError(
          400,
          `Value too long for column: ${error.meta?.column_name}`,
          error.meta
        );

      case "P2011":
        return new ApiError(
          400,
          `Null constraint failed: ${error.meta?.target}`,
          error.meta
        );

      case "P2012":
        return new ApiError(
          400,
          `Missing required field: ${error.meta?.target}`,
          error.meta
        );

      case "P2016":
        return new ApiError(404, "Query did not return any results.", error.meta);

      case "P2022":
        return new ApiError(400, `Column does not exist: ${error.meta?.column}`, error.meta);

      case "P2019":
        return new ApiError(400, `Invalid input: ${error.meta?.details}`, error.meta);

      default:
        return new ApiError(500, `Unknown Prisma error: ${error.code}`, error.meta);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ApiError(400, `Invalid data input: ${error.message}`, error);
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return new ApiError(500, "Prisma runtime error. Try restarting the server.", error);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new ApiError(500, "Database connection error. Check your DB settings.", error);
  }

  return new ApiError(500, "An unexpected error occurred.", error);
};
