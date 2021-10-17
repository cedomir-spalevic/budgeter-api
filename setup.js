import fs from "fs";

export const loadConfigs = () => {
   const configPath =process.env.ENV === "development" ? "./config/development.json" : "./config/production.json";

   const config = JSON.parse(fs.readFileSync(configPath));
   Object.keys(config).forEach(key => {
      process.env[key] = config[key];
   });
};