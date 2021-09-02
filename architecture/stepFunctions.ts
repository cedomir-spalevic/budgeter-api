import { StepFunctionsDef } from "../types/serverless";

const stepFunctions: StepFunctionsDef = {
   validate: true,
   stateMachines: {
      "clear-tokens-job": {
         events: {
            schedule: {
               rate: "cron(0 15 * * ? *)",
               enabled: true
            }
         },
         definition: {
            Comment: "Step function to clear any expired tokens",
            StartAt: "InvokeFunction",
            States: {
               InvokeFunction: {
                  Type: "Task",
                  Resource: {
                     "Fn::GetAtt": ["batch-clear-tokens", "Arn"]
                  },
                  Parameters: {
                     Payload: {
                        Input: {
                           apiKey: "${env:BUDGETER_API_KEY}"
                        }
                     }
                  },
                  End: true
               }
            }
         }
      },
      "payment-notifications-job": {
         events: {
            schedule: {
               rate: "cron(0 15 * * ? *)",
               enabled: true
            }
         },
         definition: {
            Comment: "Step function to send any payment notifications",
            StartAt: "InvokeFunction",
            States: {
               InvokeFunction: {
                  Type: "Task",
                  Resource: {
                     "Fn::GetAtt": ["batch-payment-notifications", "Arn"]
                  },
                  Parameters: {
                     Payload: {
                        Input: {
                           apiKey: "${env:BUDGETER_API_KEY}"
                        }
                     }
                  },
                  End: true
               }
            }
         }
      },
      "income-notifications-job": {
         events: {
            schedule: {
               rate: "cron(0 15 * * ? *)",
               enabled: true
            }
         },
         definition: {
            Comment: "Step function to send any income notifications",
            StartAt: "InvokeFunction",
            States: {
               InvokeFunction: {
                  Type: "Task",
                  Resource: {
                     "Fn::GetAtt": ["batch-income-notifications", "Arn"]
                  },
                  Parameters: {
                     Payload: {
                        Input: {
                           apiKey: "${env:BUDGETER_API_KEY}"
                        }
                     }
                  },
                  End: true
               }
            }
         }
      }
   }
}

export default stepFunctions;