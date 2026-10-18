const { validateEnvironment } = require("./config/environment");
const config = validateEnvironment();
const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const compression = require("compression");
const { connectDatabase } = require("./config/database");
const AppError = require("./utils/appError");
const app = express();
// Vercel supplies the forwarding proxy; direct local requests do not trust it.
app.set("trust proxy", process.env.VERCEL ? 1 : false);
app.use(
  cors({
    origin(origin, done) {
      done(
        origin && origin !== config.frontendUrl
          ? new AppError("Origin is not allowed.", 403)
          : null,
        true,
      );
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(mongoSanitize());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use("/legacy", express.static(path.join(__dirname, "upload")));

app.get("/health", (req, res) =>
  res.json({ status: "ok", database: "not_checked" }),
);
app.get("/health/db", async (req, res, next) => {
  try {
    const db = await connectDatabase();
    await db.connection.db.admin().command({ ping: 1 });
    res.json({ status: "ok", database: "connected" });
  } catch {
    next(new AppError("Database unavailable. Please try again later.", 503));
  }
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many attempts. Please try again later.",
  },
});
// shortcut: counters are per function instance, use Vercel WAF or a shared store before public high-traffic use.
app.use(
  [
    "/users/login",
    "/users/signup",
    "/users/forgotPassword",
    "/users/resetPassword",
  ],
  authLimiter,
);
app.use(["/users", "/menu", "/bookings"], async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});
app.use("/users", require("./routes/users"));
app.use("/menu", require("./routes/menu"));
app.use("/bookings", require("./routes/bookings"));
app.all("*", (req, res, next) => next(new AppError("Route not found.", 404)));
app.use(require("./controllers/errorController"));
module.exports = app;
