import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { ObjectId } from "mongodb";
import { processDeleteAPIKey } from "./processor";

export interface DeleteAPIKeyBody {
   apiKeyId: ObjectId;
}

const validator = async (
   event: APIGatewayProxyEvent
): Promise<DeleteAPIKeyBody> => {
   await isAdminAuthorized(event);
   const apiKeyId = getPathParameter("apiKeyId", event.pathParameters);
   return { apiKeyId };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const deleteApiKeyBody = await validator(event);
      await processDeleteAPIKey(deleteApiKeyBody);
      return {
         statusCode: 200,
         body: "",
         headers: {
            "Access-Control-Allow-Origin": "*",
         },
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
