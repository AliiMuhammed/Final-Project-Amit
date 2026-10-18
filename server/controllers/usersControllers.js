const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const media = require("../utils/media");
exports.uploadUserPhoto = media.upload.single("image");
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError("Use the password update route.", 400));
  if (req.file) req.uploadedImage = await media.uploadImage(req.file.buffer);
  next();
});
function profileFields(body) {
  const { firstName, lastName, email, phone } = body;
  return Object.fromEntries(
    Object.entries({ firstName, lastName, email, phone }).filter(
      ([, value]) => value !== undefined,
    ),
  );
}
exports.updateMe = catchAsync(async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.user.id);
    if (!user) throw new AppError("User not found.", 404);
    const body = profileFields(req.body);
    if (req.uploadedImage) body.file = req.uploadedImage;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) throw new AppError("User not found.", 404);
    if (req.uploadedImage && user.file !== updatedUser.file)
      await media.removeImage(user.file);
    res.status(200).json({ status: "success", data: { user: updatedUser } });
  } catch (error) {
    await media.removeImage(req.uploadedImage);
    throw error;
  }
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.changeStatus = factory.changeStatus(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = (req, res, next) => {
  req.body = profileFields(req.body);
  return factory.updateOne(User)(req, res, next);
};
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
