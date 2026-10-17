const dns = require("node:dns/promises");
const mongoose = require("mongoose");
const { validateEnvironment } = require("../config/environment");
const { connectDatabase } = require("../config/database");
async function check() {
  validateEnvironment();
  const uri = process.env.MONGODB_URI;
  if (uri.startsWith("mongodb+srv://")) {
    const hostname = new URL(uri).hostname;
    try {
      await dns.resolveSrv(`_mongodb._tcp.${hostname}`);
    } catch {
      throw new Error(
        "MongoDB SRV DNS lookup failed. Check the new Atlas URI and local DNS.",
      );
    }
    console.log("SRV DNS: verified");
  }
  const connection = await connectDatabase();
  try {
    await connection.connection.db.admin().command({ ping: 1 });
  } catch {
    throw new Error("Database ping failed. Check database permissions and cluster availability.");
  }
  console.log(
    "Database authentication, network connection and ping: verified (no records written).",
  );
}
check()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
