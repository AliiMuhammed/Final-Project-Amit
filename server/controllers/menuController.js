/**
 * This file defines controllers for managing menu items, including photo uploads and CRUD operations.
 *
 * Key functionalities:
 * 1. Handles file uploads and image processing:
 *    - Uses `multer` for handling photo uploads (`uploadItemPhotos`).
 *    - Processes images with `sharp` to resize and optimize them (`resizeItemPhotos`).
 * 2. Provides reusable CRUD operations for menu items:
 *    - Create a menu item (`createItem`).
 *    - Retrieve all menu items (`getAllItems`).
 *    - Retrieve a single menu item by ID (`getItem`).
 *    - Update a menu item (`updateItem`).
 *    - Delete a menu item (`deleteItem`).
 * 3. Includes middleware for filtering and validating uploaded files (e.g., ensuring only images are uploaded).
 * 4. Promotes modularity and reusability by leveraging a factory pattern for generic CRUD operations.
 * 5. Ensures consistent error handling with `catchAsync` and `AppError`.
 *
 * This module is designed for managing menus in an application with optimized image handling.
 */
const Menu = require("../models/menuModel");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadItemPhotos = upload.single("photo");

exports.resizeItemPhotos = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `item-${req.user.id}-${Date.now()}.jpeg`;
  req.body.file = req.file.filename;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`upload/${req.file.filename}`);

  next();
});

exports.getAllItems = factory.getAll(Menu);

exports.getItem = factory.getOne(Menu);

exports.createItem = factory.createOne(Menu);

exports.updateItem = factory.updateOne(Menu);

exports.deleteItem = factory.deleteOne(Menu);
