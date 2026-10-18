const mongoose = require("mongoose");
const { validateEnvironment } = require("./environment");
const AppError = require("../utils/appError");
// Initialize explicitly after connecting so temporary index failures can retry.
mongoose.set("autoCreate", false);
mongoose.set("autoIndex", false);
let connectionPromise;

function connectDatabase() {
  if (connectionPromise) return connectionPromise;
  validateEnvironment();
  connectionPromise = mongoose
    .connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      maxPoolSize: 5,
      minPoolSize: 0,
    })
    .then(async (connection) => {
      await Promise.all(
        Object.values(mongoose.models).map(async (model) => {
          await model.createCollection();
          await model.createIndexes();
        }),
      );
      return connection;
    })
    .catch(() => {
      connectionPromise = undefined;
      throw new AppError("Database unavailable. Please try again later.", 503);
    });
  return connectionPromise;
}
mongoose.connection.on("disconnected", () => {
  connectionPromise = undefined;
});
module.exports = { connectDatabase };
