const { v2: cloudinary } = require("cloudinary");
const sharp = require("sharp");
const multer = require("multer");
const { randomUUID } = require("crypto");
const AppError = require("./appError");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024, files: 1, fields: 15, parts: 16 },
  fileFilter(req, file, done) {
    done(
      file.mimetype.startsWith("image/")
        ? null
        : new AppError("Please upload an image.", 400),
      true,
    );
  },
});
function configureCloudinary() {
  for (const key of [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ]) {
    if (!process.env[key])
      throw new AppError("Image storage is not configured.", 503);
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}
async function uploadImage(buffer) {
  let image;
  try {
    image = await sharp(buffer, { limitInputPixels: 25000000 })
      .rotate()
      .resize(500, 500)
      .jpeg({ quality: 90 })
      .toBuffer();
  } catch {
    throw new AppError("Invalid or unsupported image.", 400);
  }
  configureCloudinary();
  try {
    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: `bistro-bliss/${randomUUID()}`,
          resource_type: "image",
          overwrite: false,
        },
        (error, result) => (error ? reject(error) : resolve(result.secure_url)),
      );
      stream.on("error", reject);
      stream.end(image);
    });
  } catch {
    throw new AppError("Image upload failed. Please try again.", 502);
  }
}
async function removeImage(file) {
  if (!file || !process.env.CLOUDINARY_CLOUD_NAME) return;
  const prefix = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`;
  if (!file.startsWith(prefix)) return;
  const match = file
    .slice(prefix.length)
    .match(/^v\d+\/(bistro-bliss\/[\w-]+)\.[a-z]+$/i);
  if (!match) return;
  try {
    configureCloudinary();
    await cloudinary.uploader.destroy(match[1], { invalidate: true });
  } catch {
    console.error(
      "Image cleanup failed; review unreferenced Bistro Bliss assets in Cloudinary.",
    );
  }
}
function fileUrl(file) {
  if (!file) return undefined;
  if (file.startsWith("https://")) return file;
  return new URL(
    `/legacy/${encodeURIComponent(file)}`,
    process.env.PUBLIC_API_URL || "http://localhost:4000",
  ).href;
}
module.exports = { upload, uploadImage, removeImage, fileUrl };
