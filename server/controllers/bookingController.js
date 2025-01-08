/**
 * This file manages the business logic for handling booking operations.
 * It provides controllers for creating, retrieving, and updating bookings.
 *
 * Key functionalities:
 * 1. Automatically sets the user ID in the booking request (`setIDs`).
 * 2. Utilizes a reusable factory function to create and fetch bookings (`createBooking`, `getBookings`).
 * 3. Allows changing the booking status (e.g., "Confirmed" or "Declined") based on input (`changeStatus`).
 *
 * The module leverages utility functions like `catchAsync` for error handling and ensures code reusability with `handlerFactory`.
 */
const Bookings = require("../models/bookingModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.setIDs = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

exports.createBooking = factory.createOne(Bookings);

exports.getBookings = factory.getAll(Bookings);

exports.changeStatus = catchAsync(async (req, res, next) => {
  if (req.body.status === "accepted") {
    await Bookings.findByIdAndUpdate(req.params.bookingID, {
      status: "Confirmed",
    });
  } else {
    await Bookings.findByIdAndUpdate(req.params.bookingID, {
      status: "Declined",
    });
  }

  res.status(201).json({
    status: "success",
  });
});
