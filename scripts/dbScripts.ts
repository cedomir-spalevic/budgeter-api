import { config } from "dotenv";
import fs from "fs";
import { exec } from "child_process";
import async from "async";

config();

const folder = "scripts/db/";
const files = fs.readdirSync(folder);
const executeScripts = files.filter(file => file.endsWith(".js") || file.endsWith(".ts")).map(file => {
   const command = file.endsWith(".js") ? "node" : "ts-node";
   return exec.bind(null, `${command} ${folder}${file}`);
});

const getResults = (error: Error, data: string[][]) => {
   if(error) {
      return console.error(error);
   }
   const results = data.map(d => d.join(""));
   console.log("DB Scripts Results: ");
   console.log(results);
}

async.series(executeScripts, getResults);