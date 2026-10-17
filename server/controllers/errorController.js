const AppError = require("../utils/appError");
module.exports = (err, req, res, next) => {
  let error = err;
  if (err.name === "CastError")
    error = new AppError("Invalid identifier or field value.", 400);
  if (err.code === 11000)
    error = new AppError("That value is already in use.", 400);
  if (err.name === "ValidationError")
    error = new AppError(
      "Invalid input data. Check the required fields and their formats.",
      400,
    );
  if (
    ["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(
      err.name,
    )
  )
    error = new AppError("Invalid or expired token. Please log in again!", 401);
  if (err.name === "MulterError")
    error = new AppError(
      err.code === "LIMIT_FILE_SIZE"
        ? "Image must be 3 MB or smaller."
        : "Invalid image upload.",
      400,
    );
  if (err.type === "entity.too.large")
    error = new AppError("Request is too large.", 413);
  if (err.type === "entity.parse.failed")
    error = new AppError("Invalid JSON body.", 400);
  if (!error.isOperational)
    console.error("Request failed:", error.name || "Error");
  res.status(error.isOperational ? error.statusCode : 500).json({
    status: error.isOperational ? error.status : "error",
    message: error.isOperational
      ? error.message
      : "Something went wrong. Please try again later.",
  });
};
