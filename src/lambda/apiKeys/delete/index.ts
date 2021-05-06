import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { processDeleteAPIKey } from "./processor";
import { validate } from "./validator";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      await isAdminAuthorized(event);
      const apiKeyId = validate(event.pathParameters);
      await processDeleteAPIKey(apiKeyId);
      return {
         statusCode: 200,
         body: ""
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
