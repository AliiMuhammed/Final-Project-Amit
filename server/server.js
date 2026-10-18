#!/usr/bin/env node
// Local listener only. Vercel loads app.js directly.
const app = require("./app");
const { connectDatabase } = require("./config/database");
const mongoose = require("mongoose");
async function start() {
  await connectDatabase();
  const port = Number(process.env.PORT || 4000);
  const server = app.listen(port, () =>
    console.log(`Bistro Bliss API listening on port ${port}`),
  );
  server.on("error", async () => {
    console.error("HTTP server could not start.");
    await mongoose.disconnect();
    process.exitCode = 1;
  });
  process.on("SIGTERM", () =>
    server.close(async () => {
      await mongoose.disconnect();
    }),
  );
  process.on("SIGINT", () =>
    server.close(async () => {
      await mongoose.disconnect();
    }),
  );
}
module.exports = app;
if (require.main === module)
  start().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
