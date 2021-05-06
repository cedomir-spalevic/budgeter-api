import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { AdminPublicUser } from "models/data/user";
import { GetResponse } from "models/responses";
import { processGetMany, processGetSingle } from "./processor";
import { validate } from "./validator";

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      await isAdminAuthorized(event);
      const getUsersBody = await validate({
         queryStrings: event.queryStringParameters,
         pathParameters: event.pathParameters
      });
      let response: GetResponse<AdminPublicUser> | AdminPublicUser;
      if (getUsersBody.queryStrings)
         response = await processGetMany(getUsersBody.queryStrings);
      else
         response = await processGetSingle(getUsersBody.pathParameters.userId);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
