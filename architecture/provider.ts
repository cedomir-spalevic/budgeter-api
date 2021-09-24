import type { Provider } from "serverless/aws";

const provider: Provider = {
   name: "aws",
   runtime: "nodejs12.x",
   lambdaHashingVersion: 20201221,
   region: "us-east-1",
   stackName: "budgeter",
   apiName: "budgeter",
   stage: `${process.env.AWS_STAGE}`,
   memorySize: 128,
   timeout: 10,
   deploymentPrefix: ""
}

export default provider;