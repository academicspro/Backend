import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";


export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${err.message}`, err.details || err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errorCode: err.statusCode,
    details: err.details || null,
  });
};
