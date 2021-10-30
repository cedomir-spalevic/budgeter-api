import fs from "fs";
import url from "url";
import path from "path";

const loadConfigs = () => {
   const configPath = process.env.LOCAL === "true" ? "./config/development.json" : "./config/production.json";

   const config = JSON.parse(fs.readFileSync(configPath));
   Object.keys(config).forEach(key => {
      process.env[key] = config[key];
   });
};

const setupGlobal = () => {
   global.__dirname = path.dirname(url.fileURLToPath(import.meta.url));
};

export default  () => {
   loadConfigs();
   setupGlobal();
};