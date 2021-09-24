import providerConfig from "./provider";
import functionsConfig from "./functions";
import customConfig from "./custom";
import stepFunctionsConfig from "./stepFunctions";
import { Serverless } from "serverless/aws";
import dotenv from "dotenv";

dotenv.config();

console.log(`ENV = ${process.env.AWS_STAGE}`)

const configuration: Serverless = {
   org: "cedomirspalevic",
   app: "budgeter",
   service: "budgeter-api",
   frameworkVersion: "2.28.7",
   provider: providerConfig,
   functions: functionsConfig,
   plugins: [
      "@serverless/safeguards-plugin",
      "serverless-bundle",
      "serverless-offline",
      "serverless-step-functions",
      "serverless-pseudo-parameters",
      "serverless-iam-roles-per-function",
      "serverless-dotenv-plugin"
   ],
   stepFunctions: stepFunctionsConfig,
   custom: customConfig
}

export default configuration;