import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { ObjectId } from "mongodb";
import { processDeleteUser } from "./processor";

export interface DeleteUserBody {
   adminId: ObjectId;
   userId: ObjectId;
}

const validator = async (
   event: APIGatewayProxyEvent
): Promise<DeleteUserBody> => {
   const adminId = await isAdminAuthorized(event);
   const userId = getPathParameter("userId", event.pathParameters);
   return { adminId, userId };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const deleteUserBody = await validator(event);
      await processDeleteUser(deleteUserBody);
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
