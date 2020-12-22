import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { isStr, isValidJSONBody } from "middleware/validators";
import { UserClaims } from "models/auth";
import { processUpdateUser } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      await isAdminAuthorized(event);
      const userId = getPathParameter("userId", event.pathParameters);
      const form = isValidJSONBody(event.body);
      const claims = isStr(form, "claims");
      const userClaims: UserClaims[] = [];
      if (claims) {
         const list = claims.split(",");
         if (list.includes("service"))
            userClaims.push(UserClaims.Service);
         if (list.includes("admin"))
            userClaims.push(UserClaims.Admin);
      }

      const response = await processUpdateUser(userId, userClaims);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}