const fs = require("fs");

const loadConfigs = () => {
   const configPath = process.env.LOCAL === "true" ? "./config/development.json" : "./config/production.json";

   const config = JSON.parse(fs.readFileSync(configPath));
   Object.keys(config).forEach(key => {
      process.env[key] = config[key];
   });
};

module.exports = () => {
   loadConfigs();
};