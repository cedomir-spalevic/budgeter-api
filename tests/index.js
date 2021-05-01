/* eslint-disable no-undef */
import { exec } from "child_process";
import { series } from "async";

series([
   () => exec("npm run dev", (error, stdout, stderr) => {
      if(error) {
         console.error(`exec error: ${error}`);
         return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
   })
])