import { Request, Response, NextFunction } from "express";
import { MongoError } from "mongodb";
import { CastError, Error as MongooseError } from "mongoose";
import {AppError} from "../../../shared/utils/appError";

const handleCastErrorDB = (err: CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongoError & { keyValue?: Record<string, any> }): AppError => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : "unknown";
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: MongooseError.ValidationError): AppError => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = (): AppError => {
  return new AppError("Invalid token. Please login again.", 401);
};

const handleJWTExpiredError = (): AppError => {
  return new AppError("Token expired. Please login again.", 401);
};

const sendErrorDev = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR:", err);
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

// Type guard to check if the error is an instance of AppError
const isAppError = (err: any): err is AppError => err instanceof AppError;

const globalErrorHandler = (
  err: any, // Set to any to allow type checks
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!isAppError(err)) {
    err.statusCode = 500;
    err.status = "error";
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err as AppError, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (err.name === "CastError") error = handleCastErrorDB(err as CastError);
    if ((err as MongoError).code === 11000) error = handleDuplicateFieldsDB(err as MongoError);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err as MongooseError.ValidationError);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error as AppError, res);
  }
};

export default globalErrorHandler;
