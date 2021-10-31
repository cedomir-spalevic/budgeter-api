const { readFileSync } = require("fs";
const babelRegister = require("@babel/register";
const "@babel/polyfill";

const babelConfig = JSON.parse(readFileSync("./.babelrc", "utf8"));
babelRegister(babelConfig);

export default {
   verbose: true,
   clearMocks: true,
   transform: {
      "^.+\\.js?$": "babel-jest"
   }
};