import { APIGatewayProxyResult } from "aws-lambda";
import { isAPIKeyAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { StepFunctionBatchJobRequest } from "models/requests";
import { clearTokens } from "./processor";

export const handler = async (
   event: StepFunctionBatchJobRequest
): Promise<APIGatewayProxyResult> => {
   try {
      await isAPIKeyAuthorized(event);
      await clearTokens();
      return {
         statusCode: 200,
         body: "",
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
