import providerConfig from "./provider";
import functionsConfig from "./functions";
import customConfig from "./custom";
import stepFunctionsConfig from "./stepFunctions";
import { Serverless } from "../types/serverless";

const configuration: Serverless = {
   org: "cedomirspalevic",
   app: "budgeter",
   service: "budgeter",
   useDotenv: true,
   variablesResolutionMode: "20210326",
   frameworkVersion: "2.35",
   provider: providerConfig,
   functions: functionsConfig,
   plugins: [
      "@serverless/safeguards-plugin",
      "serverless-bundle",
      "serverless-offline",
      "serverless-step-functions",
      "serverless-pseudo-parameters"
   ],
   stepFunctions: stepFunctionsConfig,
   custom: customConfig
}

export default configuration;