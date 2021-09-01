const path = require("path");
let config;
if (process.execPath.includes("node")) {
  config = require(path.join(__dirname, "..", "/dev.config.json"));
} else {
  config = require(path.join(process.execPath, "../", "./config.json"));
}
module.exports = config;
