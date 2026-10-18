const { test, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const { Writable } = require("node:stream");
const sharp = require("sharp");
const { v2: cloudinary } = require("cloudinary");
const media = require("../utils/media");
const factory = require("../controllers/handlerFactory");
Object.assign(process.env, {
  NODE_ENV: "test",
  MONGODB_URI: "mongodb://127.0.0.1:27017/bistro_test",
  JWT_SECRET: "test-secret-with-at-least-32-characters",
  FRONTEND_URL: "http://localhost:3000",
  CLOUDINARY_CLOUD_NAME: "test-cloud",
  CLOUDINARY_API_KEY: "test-key",
  CLOUDINARY_API_SECRET: "test-secret",
});
afterEach(() => mock.restoreAll());
function invoke(handler, req) {
  return new Promise((resolve, reject) =>
    handler(
      req,
      {
        status() {
          return this;
        },
        json: resolve,
        end: resolve,
      },
      reject,
    ),
  );
}
test("valid images are optimized before Cloudinary receives them", async () => {
  const input = await sharp({
    create: { width: 20, height: 10, channels: 3, background: "red" },
  })
    .png()
    .toBuffer();
  let uploaded, options;
  mock.method(cloudinary.uploader, "upload_stream", (opts, callback) => {
    options = opts;
    return new Writable({
      write(chunk, encoding, done) {
        uploaded = chunk;
        done();
      },
      final(done) {
        callback(null, {
          secure_url:
            "https://res.cloudinary.com/test-cloud/image/upload/v1/bistro-bliss/new.jpeg",
        });
        done();
      },
    });
  });
  assert.match(await media.uploadImage(input), /^https:/);
  const metadata = await sharp(uploaded).metadata();
  assert.equal(metadata.format, "jpeg");
  assert.equal(metadata.width, 500);
  assert.equal(metadata.height, 500);
  assert.match(options.public_id, /^bistro-bliss\//);
  assert.equal(options.overwrite, false);
});
test("missing storage configuration and upload failures are safe", async () => {
  const input = await sharp({
    create: { width: 1, height: 1, channels: 3, background: "red" },
  })
    .png()
    .toBuffer();
  const key = process.env.CLOUDINARY_API_SECRET;
  delete process.env.CLOUDINARY_API_SECRET;
  await assert.rejects(
    media.uploadImage(input),
    (error) => error.statusCode === 503,
  );
  process.env.CLOUDINARY_API_SECRET = key;
  mock.method(
    cloudinary.uploader,
    "upload_stream",
    (options, callback) =>
      new Writable({
        write(c, e, done) {
          callback(new Error("private-cloud-secret"));
          done();
        },
      }),
  );
  await assert.rejects(
    media.uploadImage(input),
    (error) => error.statusCode === 502 && !error.message.includes("private"),
  );
});
test("cleanup only deletes this application's managed cloud assets", async () => {
  const ids = [];
  mock.method(cloudinary.uploader, "destroy", async (id) => ids.push(id));
  for (const file of [
    "default.png",
    "../../other",
    "https://res.cloudinary.com/other/image/upload/v1/bistro-bliss/owned.jpeg",
    "https://res.cloudinary.com/test-cloud/image/upload/v1/other/asset.jpeg",
  ])
    await media.removeImage(file);
  await media.removeImage(
    "https://res.cloudinary.com/test-cloud/image/upload/v1/bistro-bliss/owned.jpeg",
  );
  assert.deepEqual(ids, ["bistro-bliss/owned"]);
});
test("database write failure cleans the new upload and leaves the old image intact", async () => {
  const removed = [];
  mock.method(media, "removeImage", async (file) => {
    if (file) removed.push(file);
  });
  const Model = {
    findById: async () => ({ file: "old-image" }),
    findByIdAndUpdate: async () => {
      throw new Error("validation failed");
    },
  };
  await assert.rejects(
    invoke(factory.updateOne(Model), {
      params: { id: "1" },
      body: { file: "new-image" },
      uploadedImage: "new-image",
    }),
    /validation/,
  );
  assert.deepEqual(removed, ["new-image"]);
});
test("metadata-only edits keep images and successful replacements remove the old one", async () => {
  const removed = [];
  mock.method(media, "removeImage", async (file) => {
    if (file) removed.push(file);
  });
  const Model = {
    findById: async () => ({ file: "old-image" }),
    findByIdAndUpdate: async (id, body) => ({ file: body.file || "old-image" }),
  };
  await invoke(factory.updateOne(Model), {
    params: { id: "1" },
    body: { name: "Dinner" },
  });
  assert.deepEqual(removed, []);
  await invoke(factory.updateOne(Model), {
    params: { id: "1" },
    body: { file: "new-image" },
    uploadedImage: "new-image",
  });
  assert.deepEqual(removed, ["old-image"]);
});
test("file URLs support repository assets and persistent HTTPS URLs", () => {
  assert.equal(
    media.fileUrl("default.png"),
    "http://localhost:4000/legacy/default.png",
  );
  assert.equal(
    media.fileUrl("https://res.cloudinary.com/test/test.jpg"),
    "https://res.cloudinary.com/test/test.jpg",
  );
});
