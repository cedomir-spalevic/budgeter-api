import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { processDeleteUser } from "./processor";
import { validate } from "./validator";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      await isAdminAuthorized(event);
      const userId = await validate(event.pathParameters);
      await processDeleteUser(userId);
      return {
         statusCode: 200,
         body: ""
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
