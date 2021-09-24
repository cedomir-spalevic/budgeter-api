import type { Custom } from "serverless/aws";

const custom: Custom = {
   "serverless-offline": {
      httpPort: 4000,
      useChildProcesses: true
   },
   bundle: {
      sourcemaps: "false",
      forceExclude: [
         "aws-sdk"
      ],
      linting: false
   },
   dotenv: {
      exclude: [
         "AWS_ACCESS_KEY_ID",
         "AWS_SECRET_ACCESS_KEY",
         "AWS_REGION",
         "AWS_STAGE"
      ]
   }
}

export default custom;