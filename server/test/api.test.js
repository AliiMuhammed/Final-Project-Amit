const { test, before, after, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
Object.assign(process.env, {
  NODE_ENV: "test",
  JWT_SECRET: "test-secret-with-at-least-32-characters",
  JWT_EXPIRES_IN: "1d",
  FRONTEND_URL: "http://localhost:3000",
  MONGODB_URI: "mongodb://127.0.0.1:27017/bistro_test",
});
let dbFails = false;
const database = require("../config/database");
// Atlas is deliberately stubbed; these tests exercise HTTP routing and controllers.
database.connectDatabase = async () => {
  if (dbFails) throw new Error("private-db-password");
  return {
    connection: { db: { admin: () => ({ command: async () => ({ ok: 1 }) }) } },
  };
};
const app = require("../app");
const User = require("../models/userModel");
const Menu = require("../models/menuModel");
const Booking = require("../models/bookingModel");
let server, base;
before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise((resolve) => server.close(resolve));
});
afterEach(() => {
  mock.restoreAll();
  dbFails = false;
});
const userId = "507f1f77bcf86cd799439011";
function auth(role = "user") {
  mock.method(User, "findById", async () => ({
    id: userId,
    role,
    active: true,
    changedPasswordAfter: () => false,
  }));
  return {
    Authorization: `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET)}`,
  };
}
async function request(path, options = {}) {
  const response = await fetch(base + path, options);
  return {
    status: response.status,
    headers: response.headers,
    body: response.status === 204 ? null : await response.json(),
  };
}
function queryResult(value, captures) {
  return {
    find(filter) {
      captures?.push(filter);
      return this;
    },
    sort() {
      return this;
    },
    select() {
      return this;
    },
    skip() {
      return this;
    },
    limit() {
      return this;
    },
    then(resolve, reject) {
      return Promise.resolve(value).then(resolve, reject);
    },
  };
}
test("health separates process availability from database ping", async () => {
  dbFails = true;
  const health = await request("/health");
  assert.equal(health.status, 200);
  assert.equal(health.body.database, "not_checked");
  const db = await request("/health/db");
  assert.equal(db.status, 503);
  assert.ok(!JSON.stringify(db.body).includes("private"));
  dbFails = false;
  assert.equal((await request("/health/db")).body.database, "connected");
});
test("only configured CORS origin is accepted including preflight", async () => {
  const headers = {
    Origin: process.env.FRONTEND_URL,
    "Access-Control-Request-Method": "PATCH",
    "Access-Control-Request-Headers": "authorization,content-type",
  };
  const response = await fetch(base + "/users/updateMe", {
    method: "OPTIONS",
    headers,
  });
  assert.equal(response.status, 204);
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    process.env.FRONTEND_URL,
  );
  assert.equal(
    (
      await request("/health", {
        headers: { Origin: "https://attacker.example" },
      })
    ).status,
    403,
  );
});
test("protected user, menu and booking routes reject missing/invalid bearer tokens", async () => {
  for (const path of [
    "/users/me",
    "/bookings",
    "/menu/507f1f77bcf86cd799439011",
  ])
    assert.equal((await request(path)).status, 401);
  assert.equal(
    (
      await request("/users/me", {
        headers: { Authorization: "Bearer invalid" },
      })
    ).status,
    401,
  );
});
test("customers cannot approve bookings or create menu items", async () => {
  const headers = { ...auth(), "Content-Type": "application/json" };
  assert.equal(
    (
      await request(`/bookings/${userId}`, {
        method: "PATCH",
        headers,
        body: '{"status":"accepted"}',
      })
    ).status,
    403,
  );
  assert.equal(
    (await request("/menu", { method: "POST", headers, body: "{}" })).status,
    403,
  );
});
test("booking queries and pagination totals are scoped to the customer", async () => {
  const captures = [];
  mock.method(Booking, "find", (filter) => {
    captures.push(filter);
    return queryResult([], captures);
  });
  mock.method(Booking, "countDocuments", async (filter) => {
    captures.push(filter);
    return 0;
  });
  const result = await request(
    "/bookings?user=507f1f77bcf86cd799439012&limit=10",
    { headers: auth() },
  );
  assert.equal(result.status, 200);
  assert.equal(result.body.totalDocs, 0);
  assert.deepEqual(captures[captures.length - 1], { user: userId });
  assert.deepEqual(captures[captures.length - 2], { user: userId });
});
test("empty menu returns a valid collection response", async () => {
  mock.method(Menu, "find", () => queryResult([]));
  mock.method(Menu, "countDocuments", async () => 0);
  const result = await request("/menu");
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.data.data, []);
  assert.equal(result.body.totalDocs, 0);
});
test("admin booking approval uses only allowed status and handles missing records", async () => {
  let changed;
  mock.method(Booking, "findByIdAndUpdate", async (id, data) => {
    changed = data;
    return { id };
  });
  const headers = { ...auth("admin"), "Content-Type": "application/json" };
  assert.equal(
    (
      await request(`/bookings/${userId}`, {
        method: "PATCH",
        headers,
        body: '{"status":"accepted"}',
      })
    ).status,
    201,
  );
  assert.deepEqual(changed, { status: "Confirmed" });
  assert.equal(
    (
      await request(`/bookings/${userId}`, {
        method: "PATCH",
        headers,
        body: '{"status":"arbitrary"}',
      })
    ).status,
    400,
  );
});
test("uploads reject non-images, corrupt images and oversized files", async () => {
  const headers = auth("admin");
  for (const [type, bytes] of [
    ["text/plain", "no"],
    ["image/jpeg", "not an image"],
    ["image/jpeg", new Uint8Array(3 * 1024 * 1024 + 1)],
  ]) {
    const form = new FormData();
    form.append("photo", new Blob([bytes], { type }), "file.jpg");
    assert.equal(
      (await request("/menu", { method: "POST", headers, body: form })).status,
      400,
    );
  }
});
test("404 and malformed JSON use safe JSON errors", async () => {
  assert.equal((await request("/unknown")).status, 404);
  assert.equal(
    (
      await request("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      })
    ).status,
    400,
  );
});
test("user list projections cannot request password hashes or reset tokens", async () => {
  const originalFind = User.find.bind(User);
  mock.method(User, "find", (...args) => {
    const query = originalFind(...args);
    query.exec = async function () {
      this._applyPaths();
      for (const field of [
        "password",
        "passwordResetToken",
        "passwordResetExpires",
      ])
        assert.notEqual(this.projection()[field], 1);
      return [];
    };
    return query;
  });
  mock.method(User, "countDocuments", async () => 0);
  const result = await request(
    "/users?fields=password,email,passwordResetToken,passwordResetExpires",
    { headers: auth("admin") },
  );
  assert.equal(result.status, 200);
});

test("booking creation assigns the authenticated customer and ignores client status", async () => {
  let stored;
  mock.method(Booking, "create", async body => { stored = body; return body; });
  const result = await request("/bookings", { method: "POST", headers: { ...auth(), "Content-Type": "application/json" }, body: JSON.stringify({ user: "another-user", status: "Confirmed", name: "Test Customer", date: "2099-12-20", time: "6:30 PM", numOfPersons: 2 }) });
  assert.equal(result.status, 201); assert.equal(stored.user, userId); assert.equal(stored.status, undefined);
  assert.equal(result.body.data.data.name, "Test Customer");
});

test("admin menu creation, reading, editing and deletion preserve API envelopes", async () => {
  const media = require("../utils/media");
  mock.method(media, "uploadImage", async () => "https://res.cloudinary.com/test-cloud/image/upload/v1/bistro-bliss/test.jpeg");
  mock.method(media, "removeImage", async () => {});
  let item;
  mock.method(Menu, "create", async body => { item = { _id: userId, ...body }; return item; });
  mock.method(Menu, "findById", () => queryResult(item));
  mock.method(Menu, "findByIdAndUpdate", async (id, body) => { item = { ...item, ...body }; return item; });
  mock.method(Menu, "findByIdAndDelete", async () => item);
  const headers = auth("admin");
  const form = new FormData();
  for (const [key, value] of Object.entries({ name: "Test Dinner", description: "A sample dinner with valid description", category: "Main Dishes", price: "10" })) form.append(key, value);
  form.append("photo", new Blob(["image-stub"], { type: "image/jpeg" }), "test.jpg");
  const created = await request("/menu", { method: "POST", headers, body: form });
  assert.equal(created.status, 201); assert.match(created.body.data.data.file, /^https:/);
  assert.equal((await request(`/menu/${userId}`, { headers })).body.data.data.name, "Test Dinner");
  const edited = await request(`/menu/${userId}`, { method: "PATCH", headers: { ...headers, "Content-Type": "application/json" }, body: '{"name":"Changed Dinner"}' });
  assert.equal(edited.status, 200); assert.equal(edited.body.data.data.name, "Changed Dinner");
  assert.equal((await request(`/menu/${userId}`, { method: "DELETE", headers })).status, 204);
});
