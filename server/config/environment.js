const path = require("path");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

function httpOrigin(value, name, production) {
  try {
    const url = new URL(value);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      (production && url.protocol !== "https:")
    )
      throw new Error();
    return url.origin;
  } catch {
    throw new Error(
      `${name} must be a valid ${production ? "HTTPS " : ""}origin without a path.`,
    );
  }
}

function validateEnvironment(env = process.env) {
  for (const name of ["MONGODB_URI", "JWT_SECRET", "FRONTEND_URL"]) {
    if (!env[name]?.trim())
      throw new Error(`Missing required environment variable: ${name}`);
  }
  try {
    const client = new MongoClient(env.MONGODB_URI);
    if (
      !client.options.dbName ||
      !/^mongodb(?:\+srv)?:\/\/[^/]+\/[^?]+/.test(env.MONGODB_URI) ||
      /[<>]/.test(env.MONGODB_URI)
    )
      throw new Error();
  } catch {
    throw new Error(
      "MONGODB_URI must be a valid MongoDB URI with an explicit database name and no placeholders.",
    );
  }
  if (env.JWT_SECRET.length < 32)
    throw new Error("JWT_SECRET must contain at least 32 characters.");
  const expiresIn = env.JWT_EXPIRES_IN || "7d";
  if (!/^\d+[smhd]$/.test(expiresIn) || parseInt(expiresIn, 10) < 1)
    throw new Error("JWT_EXPIRES_IN must be a positive duration, e.g. 7d.");
  const production = env.NODE_ENV === "production";
  const frontendUrl = httpOrigin(env.FRONTEND_URL, "FRONTEND_URL", production);
  const publicApiUrl = httpOrigin(
    env.PUBLIC_API_URL || (production ? "" : "http://localhost:4000"),
    "PUBLIC_API_URL",
    production,
  );
  return { frontendUrl, publicApiUrl, expiresIn };
}
module.exports = { validateEnvironment };
