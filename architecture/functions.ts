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
      ]
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
      ]
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
      ]
   },
   "batch-clear-tokens": {
      handler: "src/stacks/batch/clearTokens/index.handler"
   },
   "batch-income-notifications": {
      handler: "src/stacks/batch/incomeNotifications/index.handler"
   },
   "batch-payment-notifications": {
      handler: "src/stacks/batch/paymentNotifications/index.handler"
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
      ]
   }
}

export default functions;