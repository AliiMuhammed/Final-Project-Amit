const { cpSync, mkdirSync } = require("node:fs");
const path = require("node:path");
const target = path.join(__dirname, "../public/legacy");
mkdirSync(target, { recursive: true });
cpSync(path.join(__dirname, "../upload"), target, {
  recursive: true,
  force: false,
});
console.log("Repository images copied to public/legacy.");
