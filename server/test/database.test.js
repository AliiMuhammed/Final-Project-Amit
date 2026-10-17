const { test, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { validateEnvironment } = require("../config/environment");
const { connectDatabase } = require("../config/database");
const env = {
  MONGODB_URI: "mongodb://127.0.0.1:27017/bistro_test",
  JWT_SECRET: "test-secret-with-at-least-32-characters",
  FRONTEND_URL: "http://localhost:3000",
};
Object.assign(process.env, env, { NODE_ENV: "test" });
afterEach(() => {
  mock.restoreAll();
  mongoose.connection.emit("disconnected");
});
test("environment validates required values without echoing secrets", () => {
  for (const key of Object.keys(env))
    assert.throws(
      () => validateEnvironment({ ...env, [key]: "" }),
      new RegExp(key),
    );
  for (const uri of [
    "https://secret:password@example.com",
    "mongodb://localhost",
    "mongodb+srv://<user>:<password>@<host>/bistro_bliss",
    "garbage-secret",
  ]) {
    assert.throws(
      () => validateEnvironment({ ...env, MONGODB_URI: uri }),
      (error) =>
        error.message.includes("MONGODB_URI") && !error.message.includes(uri),
    );
  }
  assert.throws(
    () =>
      validateEnvironment({
        ...env,
        NODE_ENV: "production",
        PUBLIC_API_URL: "https://api.example.com",
      }),
    /FRONTEND_URL/,
  );
  assert.equal(
    validateEnvironment({
      ...env,
      NODE_ENV: "production",
      FRONTEND_URL: "https://app.example.com/",
      PUBLIC_API_URL: "https://api.example.com/",
    }).frontendUrl,
    "https://app.example.com",
  );
  for (const origin of [
    "https://app.example.com/path",
    "https://user:password@app.example.com",
    "javascript:alert(1)",
  ])
    assert.throws(
      () => validateEnvironment({ ...env, FRONTEND_URL: origin }),
      /FRONTEND_URL/,
    );
});
test("simultaneous callers share one connection promise and reuse it", async () => {
  let finish,
    calls = 0;
  mock.method(mongoose, "connect", (uri, options) => {
    calls++;
    assert.equal(uri, env.MONGODB_URI);
    assert.equal(options.maxPoolSize, 5);
    return new Promise((resolve) => {
      finish = resolve;
    });
  });
  const first = connectDatabase();
  assert.equal(connectDatabase(), first);
  finish(mongoose);
  assert.equal(await first, mongoose);
  assert.equal(connectDatabase(), first);
  assert.equal(calls, 1);
});
test("failed connections return safe errors and permit a later retry", async () => {
  let calls = 0;
  mock.method(mongoose, "connect", async () => {
    calls++;
    if (calls === 1) throw new Error("mongodb://private-password@private-host");
    return mongoose;
  });
  await assert.rejects(
    connectDatabase(),
    (error) => error.statusCode === 503 && !error.message.includes("private"),
  );
  assert.equal(await connectDatabase(), mongoose);
  assert.equal(calls, 2);
});

test("connection readiness waits for registered model indexes", async () => {
  let finish;
  let settled = false;
  mongoose.models.IntegrationIndexProbe = {
    createCollection: async () => {},
    createIndexes: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  };
  mock.method(mongoose, "connect", async () => mongoose);
  try {
    const ready = connectDatabase();
    ready.then(() => {
      settled = true;
    });
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(
      settled,
      false,
      "database must not accept registration before unique indexes are ready",
    );
    assert.equal(typeof finish, "function");
    finish();
    assert.equal(await ready, mongoose);
  } finally {
    delete mongoose.models.IntegrationIndexProbe;
  }
});

test("failed index initialization permits a later retry", async () => {
  let attempts = 0;
  const cachedFailure = Promise.reject(new Error("temporary index failure"));
  cachedFailure.catch(() => {});
  mongoose.models.IntegrationIndexProbe = {
    init: () => cachedFailure,
    createCollection: async () => {},
    createIndexes: async () => {
      if (++attempts === 1) throw new Error("temporary index failure");
    },
  };
  mock.method(mongoose, "connect", async () => mongoose);
  try {
    await assert.rejects(connectDatabase(), { statusCode: 503 });
    assert.equal(await connectDatabase(), mongoose);
    assert.equal(attempts, 2);
  } finally {
    delete mongoose.models.IntegrationIndexProbe;
  }
});
