import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAPIKeyAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { clearTokens } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      await isAPIKeyAuthorized(event);
      await clearTokens();
      return {
         statusCode: 200,
         body: ""
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}