const { test, mock, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
Object.assign(process.env, {
  NODE_ENV: "test",
  MONGODB_URI: "mongodb://127.0.0.1:27017/bistro_test",
  JWT_SECRET: "test-secret-with-at-least-32-characters",
  FRONTEND_URL: "https://frontend.example.com",
  JWT_EXPIRES_IN: "1d",
});
const User = require("../models/userModel");
const Menu = require("../models/menuModel");
const Booking = require("../models/bookingModel");
const auth = require("../controllers/authController");
const users = require("../controllers/usersControllers");
const Email = require("../utils/email");
const media = require("../utils/media");
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
      },
      (error) => (error ? reject(error) : resolve(req)),
    ),
  );
}
const fields = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  password: "password123",
  passwordConfirm: "password123",
};
test("user schema validates, hashes passwords and never persists confirmation", async () => {
  let saved;
  mock.method(User.collection, "insertOne", async (data) => {
    saved = data;
    return { acknowledged: true, insertedId: data._id };
  });
  const user = new User(fields);
  await user.save();
  assert.notEqual(saved.password, fields.password);
  assert.equal(saved.passwordConfirm, undefined);
  assert.equal(
    await user.correctPassword(fields.password, saved.password),
    true,
  );
  assert.equal(await user.correctPassword("wrong", saved.password), false);
  await assert.rejects(
    new User({ ...fields, passwordConfirm: "wrong" }).validate(),
  );
  assert.equal(user.role, "user");
  assert.equal(user.active, true);
});
test("menu and booking required fields reject invalid records without Atlas", async () => {
  await assert.rejects(new Menu({}).validate());
  await assert.rejects(new Booking({}).validate());
  const menu = new Menu({
    name: "Test Dinner",
    description: "Valid sample description for a dinner.",
    file: "default.png",
    price: 12,
    category: "Main Dishes",
  });
  await menu.validate();
  assert.equal(menu.fileUrl, "http://localhost:4000/legacy/default.png");
  const booking = new Booking({
    user: "507f1f77bcf86cd799439011",
    name: "Test User",
    time: "6:30 PM",
    date: "2099-01-01",
  });
  await booking.validate();
  assert.equal(booking.status, "In-progress");
});
test("login checks credentials and returns bearer token without setting cookies", async () => {
  const user = new User(fields);
  user.password = "hashed";
  mock.method(
    user,
    "correctPassword",
    async (password) => password === fields.password,
  );
  mock.method(User, "findOne", () => ({ select: async () => user }));
  await assert.rejects(
    invoke(auth.login, { body: { email: fields.email, password: "bad" } }),
    (error) => error.statusCode === 401,
  );
  const result = await invoke(auth.login, {
    body: { email: fields.email, password: fields.password },
  });
  assert.equal(result.code, 200);
  assert.equal(
    jwt.verify(result.body.token, process.env.JWT_SECRET).id,
    user.id,
  );
  assert.equal(result.body.data.user.password, undefined);
});
test("disabled and password-changed users cannot reuse bearer tokens", async () => {
  mock.method(User, "findById", async () => ({
    active: false,
    changedPasswordAfter: () => false,
  }));
  const req = {
    headers: {
      authorization: `Bearer ${jwt.sign({ id: "user" }, process.env.JWT_SECRET)}`,
    },
  };
  await assert.rejects(
    invoke(auth.protect, req),
    (error) => error.statusCode === 401,
  );
  User.findById.mock.restore();
  mock.method(User, "findById", async () => ({
    active: true,
    changedPasswordAfter: () => true,
  }));
  await assert.rejects(
    invoke(auth.protect, req),
    (error) => error.statusCode === 401,
  );
});
test("password reset tokens are hashed, expire, and use configured frontend URL", async () => {
  const user = new User(fields);
  mock.method(user, "save", async () => user);
  mock.method(User, "findOne", async () => user);
  let email;
  mock.method(Email.prototype, "sendPasswordReset", async function () {
    email = this;
  });
  await invoke(auth.forgotPassword, { body: { email: fields.email } });
  assert.ok(
    email.url.startsWith("https://frontend.example.com/resetPassword/"),
  );
  const token = email.url.split("/").pop();
  assert.equal(
    crypto.createHash("sha256").update(token).digest("hex"),
    user.passwordResetToken,
  );
  assert.ok(user.passwordResetExpires > Date.now());
  assert.ok(user.passwordResetExpires <= Date.now() + 10 * 60 * 1000);
});
test("email failure clears reset fields without disclosing SMTP errors", async () => {
  const user = new User(fields);
  mock.method(user, "save", async () => user);
  mock.method(User, "findOne", async () => user);
  mock.method(Email.prototype, "sendPasswordReset", async () => {
    throw new Error("private-smtp-password");
  });
  mock.method(console, "error", () => {});
  await assert.rejects(
    invoke(auth.forgotPassword, { body: { email: fields.email } }),
    (error) => error.statusCode === 500 && !error.message.includes("private"),
  );
  assert.equal(user.passwordResetToken, undefined);
  assert.equal(user.passwordResetExpires, undefined);
});
test("expired reset token is rejected and successful reset clears one-time fields", async () => {
  mock.method(User, "findOne", async (query) => {
    assert.ok(query.passwordResetExpires.$gt);
    return null;
  });
  await assert.rejects(
    invoke(auth.resetPassword, { params: { token: "expired" }, body: fields }),
    (error) => error.statusCode === 400,
  );
  User.findOne.mock.restore();
  const user = new User(fields);
  mock.method(user, "save", async () => user);
  mock.method(User, "findOne", async () => user);
  const result = await invoke(auth.resetPassword, {
    params: { token: "valid" },
    body: fields,
  });
  assert.equal(result.code, 200);
  assert.equal(user.passwordResetToken, undefined);
});
test("profile updates ignore privilege, password metadata and external image fields", async () => {
  let update;
  mock.method(User, "findById", async () => ({ file: "old-image" }));
  mock.method(User, "findByIdAndUpdate", async (id, body) => {
    update = body;
    return body;
  });
  mock.method(media, "removeImage", async () => {
    throw new Error("should not remove the old image");
  });
  await invoke(users.updateMe, {
    user: { id: "1" },
    body: {
      firstName: "Changed",
      role: "admin",
      file: "malicious",
      passwordChangedAt: null,
    },
  });
  assert.deepEqual(update, { firstName: "Changed" });
});
test("email templates render and deliver through a stub transport only", async () => {
  let message;
  mock.method(Email.prototype, "newTransport", () => ({
    sendMail: async (value) => {
      message = value;
    },
  }));
  await new Email(
    fields,
    "https://frontend.example.com/resetPassword/test-token",
  ).sendPasswordReset();
  assert.match(
    message.html,
    /https:\/\/frontend.example.com\/resetPassword\/test-token/,
  );
  assert.match(message.text, /test-token/);
  assert.equal(message.to, fields.email);
});
