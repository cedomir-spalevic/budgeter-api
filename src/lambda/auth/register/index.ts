import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { handleErrorResponse } from "middleware/errors";
import { isStr, isValidJSONBody } from "middleware/validators";
import { UserClaims } from "models/auth";
import { processRegister } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const form = isValidJSONBody(event.body);
      const email = isStr(form, "email", true);
      const password = isStr(form, "password", true);
      const claims = isStr(form, "claims");
      const userClaims: UserClaims[] = [];
      if (claims) {
         const list = claims.split(",");
         if (list.includes("service"))
            userClaims.push(UserClaims.Service);
         if (list.includes("admin"))
            userClaims.push(UserClaims.Admin);
      }

      const response = await processRegister(email, password, userClaims);
      return {
         statusCode: 201,
         body: JSON.stringify(response)
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}