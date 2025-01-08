/**
 * This file defines reusable CRUD (Create, Read, Update, Delete) and status management controllers
 * for working with MongoDB models in a Node.js application.
 *
 * Key functionalities:
 * 1. Provides generic implementations for:
 *    - Creating a document (`createOne`).
 *    - Retrieving a single document (`getOne`) or all documents (`getAll`).
 *    - Updating a document (`updateOne`).
 *    - Deleting a document (`deleteOne`), with optional file cleanup for associated files.
 * 2. Supports advanced querying, sorting, filtering, and pagination using `APIFeatures`.
 * 3. Includes functionality to toggle the `active` status of a document (`changeStatus`).
 * 4. Utilizes `catchAsync` for async error handling and `AppError` for operational error management.
 * 5. Handles file deletion during updates or deletions to maintain storage cleanliness.
 *
 * This module promotes code reusability and modularity for controllers across the application.
 */
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const fs = require("fs");


exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return next(new AppError("No Document found with that ID", 404));
    }

    if (model.file && model.file !== "default.jpg") {
      const oldFilePath = `upload/${model.file}`;
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error(`Failed to delete old photo: ${err}`);
        }
      });
    }

    const doc = await Model.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findById(req.params.id);

    if (!model) {
      return next(new AppError("No Document found with that ID", 404));
    }
       if (model.file && model.file !== "default.jpg") {
      const oldFilePath = `upload/${model.file}`;
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error(`Failed to delete old photo: ${err}`);
        }
      });
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: newDocument,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    let docs;
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let documents = await features.query;
    let totalPages;
    if (req.query.limit) {
      docs = await Model.find();
      totalPages = Math.ceil(docs.length / req.query.limit);
    } else {
      totalPages = 0;
      docs = 0;
    }
    res.status(200).json({
      status: "success",
      totalDocs: docs.length,
      totalPages,
      results: documents.length,
      data: {
        data: documents,
      },
    });
  });

exports.changeStatus = (Model) =>
  catchAsync(async (req, res, next) => {
    let url;
    const doc = await Model.findById(req.params.id);
    if (doc.active === true) {
      await Model.findByIdAndUpdate(req.params.id, { active: false });
    } else {
      await Model.findByIdAndUpdate(req.params.id, { active: true });
      if (doc.firstName) await new Email(doc, url).sendVerified();
    }

    res.status(201).json({
      status: "success",
    });
  });
