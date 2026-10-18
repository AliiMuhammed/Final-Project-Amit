const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const media = require("../utils/media");
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError("No document found with that ID", 404));
    await media.removeImage(doc.file);
    res.status(204).end();
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    try {
      const model = await Model.findById(req.params.id);
      if (!model) throw new AppError("No document found with that ID", 404);
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) throw new AppError("No document found with that ID", 404);
      if (req.uploadedImage && model.file !== doc.file)
        await media.removeImage(model.file);
      res.status(200).json({ status: "success", data: { data: doc } });
    } catch (error) {
      await media.removeImage(req.uploadedImage);
      throw error;
    }
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json({ status: "success", data: { data: doc } });
    } catch (error) {
      await media.removeImage(req.uploadedImage);
      throw error;
    }
  });
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);
    const doc = await query;
    if (!doc) return next(new AppError("No document found with that ID", 404));
    res.status(200).json({ status: "success", data: { data: doc } });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const filter = req.resourceFilter || {};
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .paginate();
    if (Model.modelName !== "User") features.limitFields();
    // Apply ownership last so client query parameters cannot replace it.
    features.query.find(filter);
    if (Model.modelName === "User")
      features.query.select(
        "-password -passwordResetToken -passwordResetExpires -__v",
      );
    const documents = await features.query;
    const totalDocs = await Model.countDocuments(filter);
    const totalPages = req.query.limit
      ? Math.ceil(totalDocs / Number(req.query.limit))
      : 0;
    res
      .status(200)
      .json({
        status: "success",
        totalDocs,
        totalPages,
        results: documents.length,
        data: { data: documents },
      });
  });
exports.changeStatus = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError("No document found with that ID", 404));
    await Model.findByIdAndUpdate(req.params.id, { active: !doc.active });
    res.status(201).json({ status: "success" });
  });
