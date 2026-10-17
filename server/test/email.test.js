const { test, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const nodemailer = require("nodemailer");
Object.assign(process.env, {
  NODE_ENV: "test",
  MONGODB_URI: "mongodb://127.0.0.1:27017/bistro_test",
  JWT_SECRET: "test-only-secret-with-at-least-32-characters",
  FRONTEND_URL: "http://localhost:3000",
  PUBLIC_API_URL: "http://localhost:4001",
  NODEMAILER_USER: "sender@gmail.com",
  NODEMAILER_PASSWORD: "unit-test-only-password",
});
const Email = require("../utils/email");
const url = "http://localhost:3000/resetPassword/unit-test-token";
const recipient = { firstName: "Test", email: "recipient@example.invalid" };
afterEach(() => mock.restoreAll());

test("reset email embeds existing logo and contains only transactional content", async () => {
  let message;
  mock.method(Email.prototype, "newTransport", () => ({
    sendMail: async (value) => {
      message = value;
    },
  }));
  await new Email(recipient, url).sendPasswordReset();
  const logo = message.attachments?.find((a) =>
    message.html.includes("cid:" + a.cid),
  );
  assert(
    logo,
    "logo must travel inside the email rather than require localhost access",
  );
  assert.deepEqual(
    logo.content,
    fs.readFileSync(path.join(__dirname, "../public/bistro-logo.png")),
  );
  assert.equal(logo.contentType, "image/png");
  assert.equal(logo.contentDisposition, "inline");
  assert.equal(message.from, `Bistro Bliss <${process.env.NODEMAILER_USER}>`);
  assert.equal(message.subject, "Reset your Bistro Bliss password");
  assert.match(message.html, /10 minutes/);
  assert.match(message.text, /used once/);
  assert.match(message.text, /unit-test-token/);
  assert.doesNotMatch(message.text, /cid:/);
  assert.doesNotMatch(
    message.html,
    /Nowhere Road|San Francisco CA|Unsubscribe|href="#"|src="https?:/i,
  );
  assert.equal(message.list, undefined);
});

test("SMTP identity and TLS settings preserve content access restrictions", () => {
  const transport = new Email(recipient, url).newTransport();
  assert.equal(transport.options.auth.user, process.env.NODEMAILER_USER);
  assert.equal(transport.options.requireTLS, true);
  assert.equal(transport.options.disableFileAccess, true);
  assert.equal(transport.options.disableUrlAccess, true);
  transport.close();
});

test("real MIME generation embeds logo bytes with file and URL access disabled", async () => {
  const transport = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  let raw;
  mock.method(Email.prototype, "newTransport", () => ({
    sendMail: async (message) => {
      raw = (await transport.sendMail(message)).message.toString();
    },
  }));
  await new Email(recipient, url).sendPasswordReset();
  assert.match(raw, /Content-Type: multipart\/related/i);
  assert.match(raw, /Content-ID: <[^>]+>/i);
  assert.match(raw, /Content-Disposition: inline/i);
  assert.match(raw, /Content-Type: image\/png/i);
  assert.match(raw, /Content-Type: text\/plain/i);
  assert.match(raw, /Content-Type: text\/html/i);
  assert.match(raw, /Message-ID:/i);
  assert.match(raw, /Date:/i);
  assert.match(raw, /From: Bistro Bliss <sender@gmail.com>/i);
});

test("Vercel function includes the logo used by MIME generation", () => {
  const config = require("../vercel.json");
  const includes = config.functions["app.js"].includeFiles;
  assert(
    Array.isArray(includes) && includes.includes("public/bistro-logo.png"),
  );
});
