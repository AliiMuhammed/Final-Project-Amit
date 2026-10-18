const Menu = require("../models/menuModel");
const catchAsync = require("../utils/catchAsync");
const media = require("../utils/media");
const factory = require("./handlerFactory");
exports.uploadItemPhotos = media.upload.single("photo");
exports.resizeItemPhotos = catchAsync(async (req, res, next) => {
  const { name, description, category, price, allQuantity } = req.body;
  req.body = Object.fromEntries(
    Object.entries({ name, description, category, price, allQuantity }).filter(
      ([, value]) => value !== undefined,
    ),
  );
  if (req.file) {
    req.uploadedImage = await media.uploadImage(req.file.buffer);
    req.body.file = req.uploadedImage;
  }
  next();
});
exports.getAllItems = factory.getAll(Menu);
exports.getItem = factory.getOne(Menu);
exports.createItem = factory.createOne(Menu);
exports.updateItem = factory.updateOne(Menu);
exports.deleteItem = factory.deleteOne(Menu);
