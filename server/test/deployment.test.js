const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const { mock } = require("node:test");
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-only-secret-at-least-32-characters";
process.env.JWT_EXPIRES_IN = "1d";
process.env.FRONTEND_URL = "http://localhost:3000";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/bistro_test";
const User = require("../models/userModel");
const auth = require("../controllers/authController");
afterEach(() => mock.restoreAll());
function invoke(handler, req) {
  return new Promise((resolve, reject) =>
    handler(
      req,
      {
        status(code) {
          this.code = code;
          return this;
        },
        json(body) {
          resolve({ code: this.code, body });
        },
        cookie() {},
      },
      reject,
    ),
  );
}
test("public registration cannot set role, reset token, or media reference", async () => {
  let stored;
  mock.method(User, "create", async (body) => {
    stored = body;
    return { _id: "507f1f77bcf86cd799439011", ...body };
  });
  await invoke(auth.signup, {
    body: {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password123",
      passwordConfirm: "password123",
      role: "admin",
      file: "arbitrary",
      passwordResetToken: "injected",
    },
    headers: {},
  });
  assert.equal(stored.role, undefined);
  assert.equal(stored.file, undefined);
  assert.equal(stored.passwordResetToken, undefined);
});
test("invalid JWT returns JSON 401 even when NODE_ENV is test", () => {
  const handler = require("../controllers/errorController");
  let code, body;
  const error = new Error("do not expose this");
  error.name = "JsonWebTokenError";
  handler(
    error,
    {},
    {
      status(value) {
        code = value;
        return this;
      },
      json(value) {
        body = value;
      },
    },
    () => {},
  );
  assert.equal(code, 401);
  assert.equal(body.status, "fail");
  assert.equal(body.stack, undefined);
});
test("deployment configuration has a validator", () => {
  const fs = require("node:fs");
  assert.ok(
    fs.existsSync(
      require("node:path").join(__dirname, "../config/environment.js"),
    ),
    "missing secure environment validation",
  );
});
