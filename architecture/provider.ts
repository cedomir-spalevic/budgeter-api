import type { Provider } from "serverless/aws";

const provider: Provider = {
   name: "aws",
   runtime: "nodejs12.x",
   lambdaHashingVersion: 20201221,
   region: "us-east-1",
   stackName: "budgeter",
   apiName: "budgeter",
   memorySize: 128,
   timeout: 10,
   deploymentPrefix: "",
   deploymentBucket: {
      tags: {
         "budgeter-env": "${opt:stage}"
      }
   },
   environment: {
      "AWS_PLATFORM_APPLICATION_IOS": "${env:AWS_PLATFORM_APPLICATION_IOS}",
      "AWS_SNS_TOPIC": "${env:AWS_SNS_TOPIC}",
      "MONGO_CONNECTION_STRING": "${env:MONGO_CONNECTION_STRING}",
      "SERVERLESS_ACCESS_KEYS": "${env:SERVERLESS_ACCESS_KEYS}",
      "JWT_KEY": "${env:JWT_KEY}",
      "JWT_ADMIN_KEY": "${env:JWT_ADMIN_KEY}",
      "BUDGETER_API_KEY": "${env:BUDGETER_API_KEY}"
   }
}

export default provider;