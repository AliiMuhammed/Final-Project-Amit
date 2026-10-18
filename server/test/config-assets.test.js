const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");
test("asset build preserves all original upload bytes", () => {
  execFileSync(process.execPath, [
    path.join(__dirname, "../scripts/prepare-assets.js"),
  ]);
  for (const name of fs.readdirSync(path.join(__dirname, "../upload"))) {
    assert.deepEqual(
      fs.readFileSync(path.join(__dirname, "../upload", name)),
      fs.readFileSync(path.join(__dirname, "../public/legacy", name)),
    );
  }
});
test("local startup fails quickly and safely without owner configuration", () => {
  const env = { PATH: process.env.PATH, NODE_ENV: "production" };
  const result = spawnSync(
    process.execPath,
    [
      "--require",
      path.join(__dirname, "isolate-env.cjs"),
      path.join(__dirname, "../server.js"),
    ],
    { env, encoding: "utf8", timeout: 3000 },
  );
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /Missing required environment variable: MONGODB_URI/,
  );
});
test("SPA fallback includes app routes and excludes missing static assets", () => {
  const config = require("../../bistro/vercel.json");
  const rule = new RegExp(`^${config.rewrites[0].source}$`);
  for (const route of [
    "/",
    "/login",
    "/register",
    "/menu",
    "/booking",
    "/profile/123",
    "/admin/home",
    "/resetPassword/token",
  ])
    assert.ok(rule.test(route), route);
  for (const route of [
    "/static/js/main.js",
    "/static/missing",
    "/favicon.ico",
    "/missing.png",
  ])
    assert.equal(rule.test(route), false, route);
});
