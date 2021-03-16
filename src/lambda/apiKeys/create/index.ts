import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { processCreateAPIKey } from "./processor";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      await isAdminAuthorized(event);
      const response = await processCreateAPIKey();
      return {
         statusCode: 200,
         body: JSON.stringify(response),
         headers: {
            "Access-Control-Allow-Origin": "*",
         },
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
