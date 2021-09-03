import type { Functions } from "serverless/aws";

const functions: Functions = {
   "auth-challenge": {
      handler: "src/stacks/auth/challenge/index.handler",
      events: [
         {
            http: {
               path: "auth/challenge",
               method: "post"
            }
         }
      ],
      iamRoleStatements: [
         {
            Effect: "Allow",
            Action: ["ses:SendEmail", "sns:Publish"],
            Resource: ["*"]
         }
      ]
   },
   "auth-challenge-confirmation": {
      handler: "src/stacks/auth/challengeConfirmation/index.handler",
      events: [
         {
            http: {
               path: "auth/challenge/{key}",
               method: "post",
               request: {
                  parameters: {
                     paths: {
                        key: true
                     }
                  }
               }
            }
         }
      ],
      iamRoleStatements: []
   },
   "auth-login": {
      handler: "src/stacks/auth/login/index.handler",
      events: [
         {
            http: {
               path: "auth/login",
               method: "post"
            }
         }
      ],
      iamRoleStatements: [
         {
            Effect: "Allow",
            Action: ["ses:SendEmail", "sns:Publish"],
            Resource: ["*"]
         }
      ]
   },
   "auth-refresh": {
      handler: "src/stacks/auth/refresh/index.handler",
      memorySize: 2028,
      events: [
         {
            http: {
               path: "auth/refresh",
               method: "post"
            }
         }
      ],
      iamRoleStatements: []
   },
   "auth-register": {
      handler: "src/stacks/auth/register/index.handler",
      events: [
         {
            http: {
               path: "auth/register",
               method: "post"
            }
         }
      ],
      iamRoleStatements: [
         {
            Effect: "Allow",
            Action: ["ses:SendEmail", "sns:Publish"],
            Resource: ["*"]
         }
      ]
   },
   "auth-register-device": {      
      handler: "src/stacks/auth/registerDevice/index.handler",
      events: [
         {
            http: {
               path: "auth/registerDevice",
               method: "post"
            }
         }
      ],
      iamRoleStatements: [
         {
            Effect: "Allow",
            Action: ["sns:CreatePlatformEndpoint", "sns:Subscribe"],
            Resource: ["*"]
         }
      ]
   },
   "auth-reset-password": {
      handler: "src/stacks/auth/resetPassword/index.handler",
      events: [
         {
            http: {
               path: "auth/resetPassword/{key}",
               method: "post",
               request: {
                  parameters: {
                     paths: {
                        key: true
                     }
                  }
               }
            }
         }
      ],
      iamRoleStatements: []
   },
   "batch-clear-tokens": {
      handler: "src/stacks/batch/clearTokens/index.handler",
      iamRoleStatements: []
   },
   "batch-income-notifications": {
      handler: "src/stacks/batch/incomeNotifications/index.handler",
      iamRoleStatements: [
         {
            Effect: "Allow",
            Action: ["sns:Publish"],
            Resource: ["*"]
         }
      ]
   },
   "batch-payment-notifications": {
      handler: "src/stacks/batch/paymentNotifications/index.handler",
      iamRoleStatements: [
         {
            Effect: "Allow",
            Action: ["sns:Publish"],
            Resource: ["*"]
         }
      ]
   },
   "graphql": {
      handler: "src/stacks/graphql/index.handler",
      events: [
         {
            http: {
               path: "graphql",
               method: "post"
            }
         }
      ],
      iamRoleStatements: []
   }
}

export default functions;