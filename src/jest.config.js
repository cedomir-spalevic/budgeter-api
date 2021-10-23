import { readFileSync } from "fs";
import babelRegister from "@babel/register";
import "@babel/polyfill";

const babelConfig = JSON.parse(readFileSync("./.babelrc", "utf8"));
babelRegister(babelConfig);

export default {
   verbose: true,
   clearMocks: true,
   transform: {
      "^.+\\.js?$": "babel-jest"
   }
};