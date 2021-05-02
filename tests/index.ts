/* eslint-disable no-undef */
import { exec } from "child_process";
import fs from "fs";
import rimraf from "rimraf";
import newman from "newman";
import chalk from "chalk";
import findProcess from "find-process";

if(fs.existsSync(".webpack")) {
   console.log(chalk.yellow("Dist folder already exists, need to remove it"));
   rimraf.sync(".webpack");
}

const localApiInstance = exec("npm run dev", (error, stdout, stderr) => {
   if (error)
      throw error;
   console.log(chalk.yellow(`stdout: ${stdout}`));
   console.error(chalk.red(`stderr: ${stderr}`));
});

const waitForWebpack = new Promise<void>((resolve) => {
   const interval = setInterval(() => {
      if(fs.existsSync(".webpack")) {
         clearInterval(interval);
         resolve();
      }
   }, 1000);
})

waitForWebpack.then(() => {
   newman.run({
      collection: "tests/Budgeter - Tests.postman_collection.json",
      reporters: "cli",
      environment: "tests/env/local.json"
   }, (error) => {
      if(error)
         throw error;
      console.log(chalk.green("Collection run complete!"));
      findProcess("port", 4000)
         .then(result => {
            result.forEach(proc => process.kill(proc.pid));
            process.kill(localApiInstance.pid);
            process.exit();
         })
         .catch(error => {
            throw error;
         })
   })
})