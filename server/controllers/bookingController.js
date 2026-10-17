const Bookings = require("../models/bookingModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
exports.setIDs = (req, res, next) => {
  const { name, phone, numOfPersons, time, date } = req.body;
  req.body = { user: req.user.id, name, phone, numOfPersons, time, date };
  next();
};
exports.createBooking = factory.createOne(Bookings);
exports.getBookings = (req, res, next) => {
  if (req.user.role !== "admin") req.resourceFilter = { user: req.user.id };
  return factory.getAll(Bookings)(req, res, next);
};
exports.changeStatus = catchAsync(async (req, res, next) => {
  const statuses = { accepted: "Confirmed", rejected: "Declined" };
  if (!Object.hasOwn(statuses, req.body.status))
    return next(new AppError("Status must be accepted or rejected.", 400));
  const booking = await Bookings.findByIdAndUpdate(
    req.params.bookingID,
    { status: statuses[req.body.status] },
    { runValidators: true },
  );
  if (!booking) return next(new AppError("Booking not found.", 404));
  res.status(201).json({ status: "success" });
});
