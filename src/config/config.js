let config;
try {
  config = require("../dev.config.json");
} catch (error) {
  config = require("../config.json");
}
module.exports = config;
