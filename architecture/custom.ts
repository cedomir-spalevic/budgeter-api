import type { Custom } from "serverless/aws";

const custom: Custom = {
   myEnvironment: {
      sourcemaps: {
         dev: true,
         prod: false
      }
   },
   "serverless-offline": {
      httpPort: 4000,
      useChildProcesses: true
   },
   bundle: {
      sourcemaps: "${self:custom.myEnvironment.sourcemaps.${opt:stage}}",
      forceExclude: [
         "aws-sdk"
      ],
      linting: false
   }
}

export default custom;