const fs = require("fs");
const { getSecrets } = require("services/gcp/secrets");

let configs = {};

const setupTestConfigs = () => {
   const testConfig = JSON.parse(fs.readFileSync("./config/development.json"));
   configs = {
      ...testConfig
   };
};

const setupConfigs = async () => {
   const userConfigPath =
      process.env.LOCAL === "true"
         ? "./config/local.json"
         : "./config/production.json";
   const userConfig = JSON.parse(fs.readFileSync(userConfigPath));
   const secretConfig = await getSecrets();
   configs = {
      ...userConfig,
      ...secretConfig
   };
};

const getConfig = (name) => {
   if (name in configs) return configs[name];
   return "";
};

module.exports = {
   setupTestConfigs,
   setupConfigs,
   getConfig
};
