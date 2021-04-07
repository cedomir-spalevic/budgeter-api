import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { ObjectId } from "mongodb";
import { processDeleteAPIKey } from "./processor";

export interface DeleteAPIKeyBody {
   apiKeyId: ObjectId;
}

const validate = async (
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
      const deleteApiKeyBody = await validate(event);
      await processDeleteAPIKey(deleteApiKeyBody);
      return {
         statusCode: 200,
         body: ""
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
