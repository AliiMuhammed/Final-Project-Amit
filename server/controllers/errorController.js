/**
 * This file defines a centralized error handling mechanism for the application.
 * It includes utility functions to handle various types of errors that may occur
 * during runtime and ensures consistent error responses for both development and production environments.
 *
 * Key functionalities:
 * 1. Handles database-specific errors like casting errors, duplicate fields, and validation errors.
 * 2. Handles authentication errors such as invalid or expired JWT tokens.
 * 3. Differentiates error responses for development and production modes:
 *    - Development: Provides detailed error information for debugging.
 *    - Production: Returns user-friendly messages for operational errors.
 * 4. Supports additional password-related validation errors.
 *
 * The module exports a middleware function to handle errors globally in the application.
 */
const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.email;
  // console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleConfirmPasswordError = (err) => {
  return new AppError(err.errors.passwordConfirm.message, 400);
};

const handlePasswordlengthError = (err) => {
  return new AppError(err.errors.password.message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleTokenExpiredError = () =>
  new AppError("Your token has expired! Please log in again", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

  } else {
    console.error("ERROR 💥", err);

    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();
    if (error.errors) {
      if (error.errors.passwordConfirm)
        error = handleConfirmPasswordError(error);
      else error = handlePasswordlengthError(error);
    }
    sendErrorProd(error, res);
  }
};
